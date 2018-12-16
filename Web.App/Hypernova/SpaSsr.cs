using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Web.App.Hypernova
{
    public class SpaSsr
    {
        private const string AppBaseUrl = "/";

        private readonly ILogger _logger;
        private readonly IHostingEnvironment _env;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly HypernovaSettings _settings;
        private readonly IDistributedCache _cache;

        public SpaSsr(ILogger logger, IHostingEnvironment env, IHttpClientFactory httpClientFactory, IOptions<HypernovaSettings> options, IDistributedCache cache)
        {
            _logger = logger;
            _env = env;
            _httpClientFactory = httpClientFactory;
            _settings = options.Value;
            _cache = cache;
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
        /// <param name="relativeAppUrl">The relative url within the app, used to make calls to Hypernova, will be prefixed with /app when rewriting the client url</param>
        /// <param name="canonicalUrl">The canonical url to use for this page, the "server-side" entry opint url</param>
        /// <returns>The html of the server-side rendered app, or the client-side html in case of errors</returns>
        public async Task<SpaSsrResult> RenderAppServerSide(HypernovaClient hypernovaClient, string relativeAppUrl, SpaSsrData renderData, TimeSpan cacheDuration, string baseAppUrl = null)
        {
            string appHtml = null;

            if (_settings.NoCaching == false)
            {
                appHtml = await _cache.GetStringAsync(relativeAppUrl);
                // If we have a cache and the rendered version is available in the cache return it, "mark" the ssr as "from cache"
                if (appHtml != null)
                {
                    appHtml = (new System.Text.RegularExpressions.Regex("- ssr -")).Replace(appHtml, "- ssr:cached -", 1);
                    return new SpaSsrResult { Html = appHtml, IsServerSideRendered = true, IsFromCache = true, Exception = null };
                }
            }

            try
            {
                appHtml = await GetAppHtml();
            }
            catch (Exception ex)
            {
                throw new HypernovaException($"Failed to retrieve app html", ex);
            }

            if (_settings.FallbackToClientSideRenderingOnly)
            {
                appHtml = BuildPage(appHtml, relativeAppUrl, renderData, baseAppUrl);
                return new SpaSsrResult { Html = appHtml, IsServerSideRendered = false, IsFromCache = false };
            }

            try
            {
                var hypernovaResult = await hypernovaClient.ReactAsyncRedux("pwa:HypernovaApp", relativeAppUrl);
                appHtml = BuildPage(appHtml, relativeAppUrl, renderData, baseAppUrl, hypernovaResult.ToString());
                if (_settings.NoCaching == false)
                {
                    DateTime absoluteExpiration = DateTime.Now.Add((TimeSpan)cacheDuration);
                    await _cache.SetStringAsync(relativeAppUrl, appHtml, new DistributedCacheEntryOptions { AbsoluteExpiration = absoluteExpiration });
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
        /// <param name="appHtml">The prestine app index.html page</param>
        /// <param name="relativeAppUrl">The relative url of the app page we are rendering</param>
        /// <param name="renderData">The initial data to render the page with</param>
        /// <param name="baseAppUrl">The base url of the app</param>
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

        private async Task<string> GetAppHtml()
        {
            if (false /*_env.IsDevelopment()*/)
            {
                var client = _httpClientFactory.CreateClient();
                var indexHtmlResponse = await client.GetAsync("http://localhost:3000?prestine");
                var indexHtml = await indexHtmlResponse.Content.ReadAsStringAsync();
                return indexHtml;
            }
            else
            {
                var indexHtmlFileInfo = _env.ContentRootFileProvider.GetFileInfo("ClientApp/build/index.html");
                var indexHtml = await File.ReadAllTextAsync(indexHtmlFileInfo.PhysicalPath);
                return indexHtml;
            }
        }
    }
}