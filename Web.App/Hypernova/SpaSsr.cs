using System;
using System.IO;
using System.Text;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Web.App.Hypernova
{
    public class SpaSsr
    {
        private const string AppBaseUrl = "/";

        private readonly ILogger _logger;
        private readonly HypernovaSettings _settings;

        public SpaSsr(ILogger logger, IOptions<HypernovaSettings> options)
        {
            _logger = logger;
            _settings = options.Value;
        }

        public SpaSsrResult RenderAppClientSide(HypernovaClient hypernovaClient, string appHtmlPath, string relativeAppUrl, SpaSsrData renderData, string baseAppUrl = null)
        {
            string appHtml;

            if (!File.Exists(appHtmlPath))
            {
                throw new HypernovaException($"Path '{appHtmlPath}' to the app html file does not exist.");
            }

            try
            {
                appHtml = System.IO.File.ReadAllText(appHtmlPath);
            }
            catch (Exception ex)
            {
                throw new HypernovaException($"Failed to read app html from path '{appHtmlPath}'", ex);
            }

            appHtml = BuildPage(appHtml, relativeAppUrl, renderData, baseAppUrl);
            return new SpaSsrResult { Html = appHtml, IsServerSideRendered = false, IsFromCache = false };
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="appHtmlPath">The path to the HTML file containing the base app code</param>
        /// <param name="relativeAppUrl">The relative url within the app, used to make calls to Hypernova, will be prefixed with /app when rewriting the client url</param>
        /// <param name="canonicalUrl">The canonical url to use for this page, the "server-side" entry opint url</param>
        /// <returns>The html of the server-side rendered app, or the client-side html in case of errors</returns>
        public SpaSsrResult RenderAppServerSide(HypernovaClient hypernovaClient, string appHtmlPath, string relativeAppUrl, SpaSsrData renderData, string baseAppUrl = null, IDistributedCache cache = null, TimeSpan? cacheDuration = null)
        {
            string appHtml;

            // If we have a cache and the rendered version is available in the cache return it, "mark" the ssr as "from cache"
            if (cache != null)
            {
                appHtml = cache.GetString(relativeAppUrl);
                if (appHtml != null)
                {
                    appHtml = (new System.Text.RegularExpressions.Regex("- ssr -")).Replace(appHtml, "- ssr:cached -", 1);
                    return new SpaSsrResult { Html = appHtml, IsServerSideRendered = true, IsFromCache = true, Exception = null };
                }

                // Have cacheDuration as optional parameter with default value 1 day
                if (cacheDuration == null)
                {
                    cacheDuration = TimeSpan.FromDays(1.0);
                }
            }

            if (!File.Exists(appHtmlPath)) {
                throw new HypernovaException($"Path '{appHtmlPath}' to the app html file does not exist.");
            }

            try
            {
                appHtml = System.IO.File.ReadAllText(appHtmlPath);
            }
            catch (Exception ex)
            {
                throw new HypernovaException($"Failed to read app html from path '{appHtmlPath}'", ex);
            }


            if (_settings.FallbackToClientSideRenderingOnly)
            {
                appHtml = BuildPage(appHtml, relativeAppUrl, renderData, baseAppUrl);
                return new SpaSsrResult { Html = appHtml, IsServerSideRendered = false, IsFromCache = false };
            }

            string hypernovaResult = null;
            try
            {
                hypernovaResult = hypernovaClient.ReactAsyncRedux("pwa:HypernovaPwaApp", relativeAppUrl).ToString();
                appHtml = BuildPage(appHtml, relativeAppUrl, renderData, baseAppUrl, hypernovaResult.ToString());
                if (cache != null)
                {
                    DateTime absoluteExpiration = DateTime.Now.Add((TimeSpan)cacheDuration);
                    cache.SetString(relativeAppUrl, appHtml, new DistributedCacheEntryOptions { AbsoluteExpiration = absoluteExpiration });
                }
                return new SpaSsrResult { Html = appHtml, IsServerSideRendered = true, IsFromCache = false, Exception = null };
            }
            catch (Exception ex)
            {
                // Logging of exception - why couldn't we do server-side rendering?
                _logger.LogCritical((new Exception($"Hypernova component rendering failed: {ex.Message}", ex)).ToString());

                // fall back to client-side rendering
                appHtml = BuildPage(appHtml, relativeAppUrl, renderData, baseAppUrl);

                return new SpaSsrResult { Html = appHtml, IsServerSideRendered = false, IsFromCache = false, Exception = new HypernovaException(ex.Message) };
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="appHtml"></param>
        /// <param name="relativeAppUrl"></param>
        /// <param name="renderData"></param>
        /// <param name="baseAppUrl"></param>
        /// <param name="hypernovaResult">If null server-side rendering is off</param>
        /// <returns></returns>
        private static string BuildPage(string appHtml, string relativeAppUrl, SpaSsrData renderData, string baseAppUrl = null, string hypernovaResult = null)
        {
            StringBuilder metaTags = new StringBuilder();
            StringBuilder endOfBodyScripts = new StringBuilder();

            if (renderData.MetaData != null)
            {
                foreach (var meta in renderData.MetaData)
                {
                    metaTags.Append($"<meta name='{meta.Name}' content='{meta.Content}'/>");
                }
            }

            if (renderData.EndOfBodyScripts != null)
            {
                foreach (var script in renderData.EndOfBodyScripts)
                {
                    endOfBodyScripts.Append($"<script src='{script}'></script>");
                }
            }

            StringBuilder endHeadReplacement = new StringBuilder();

            if (!String.IsNullOrEmpty(renderData.Title))
            {
                appHtml = (new System.Text.RegularExpressions.Regex("<title>.*?</title>")).Replace(appHtml, $"<title>{renderData.Title}</title>", 1);
            }

            // Only rewrite url on the client if we have a baseAppUrl
            if (baseAppUrl != null)
            {
                if (baseAppUrl.EndsWith("/"))
                {
                    baseAppUrl = baseAppUrl.Remove(baseAppUrl.Length - 1);
                }
                var appUrl = baseAppUrl + (relativeAppUrl == "/" ? "" : relativeAppUrl);
                endHeadReplacement.Append($"<script>window.history.replaceState({{}}, '', '{appUrl}');</script>");
            }

            if (!String.IsNullOrWhiteSpace(renderData.CanonicalUrl))
            {
                endHeadReplacement.Append($"<link rel='canonical' href='{renderData.CanonicalUrl}' />");
            }

            endHeadReplacement.Append(metaTags);

            if (hypernovaResult == null)
            {
                endHeadReplacement.Append($"<!-- {DateTime.Now.ToString("yyyyMMddHHmmss")} - ssr:off - -->");
            }
            else if (String.IsNullOrWhiteSpace(hypernovaResult))
            {
                endHeadReplacement.Append($"<!-- {DateTime.Now.ToString("yyyyMMddHHmmss")} - no ssr - -->");
            }
            else
            {
                endHeadReplacement.Append($"<!-- {DateTime.Now.ToString("yyyyMMddHHmmss")} - ssr - -->");
            }

            endHeadReplacement.Append("</head>");

            appHtml = appHtml.Replace("</head>", endHeadReplacement.ToString());
            appHtml = appHtml.Replace("</body>", endOfBodyScripts.ToString());

            if (!String.IsNullOrWhiteSpace(hypernovaResult)) {
                appHtml = AddHypernovaRenderedReactCode(hypernovaResult, appHtml); // last for performance
            }

            return appHtml;
        }

        private static string AddHypernovaRenderedReactCode(string hypernovaResult, string appHtml)
        {
            appHtml = appHtml.Replace("<div id=\"root\"></div>", "<div id=\"root\">" + hypernovaResult + "</div>");
            return appHtml;
        }
    }
}