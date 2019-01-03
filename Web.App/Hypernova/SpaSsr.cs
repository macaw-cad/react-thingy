using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text.RegularExpressions;

namespace Web.App.Hypernova
{
    public class SpaSsr
    {
        private const string DefaultBaseAppUrl = "/";

        private readonly HypernovaClient _hypernovaClient;

        private readonly ILogger _logger;
        private readonly IHostingEnvironment _env;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly HypernovaSettings _settings;
        private readonly IDistributedCache _cache;
        private readonly string _siteUrl;

        private static string _indexHtmlCache = null;
        private static bool _cssAndJsUrlsCached = false;
        private static string[] _cssUrlsCache;
        private static string[] _jsUrlsCache;

        public SpaSsr(ILogger logger, IHostingEnvironment env, IHttpClientFactory httpClientFactory, IOptions<HypernovaSettings> options, IDistributedCache cache, String siteUrl)
        {
            _logger = logger;
            _env = env;
            _httpClientFactory = httpClientFactory;
            _settings = options.Value;
            _cache = cache;
            _siteUrl = siteUrl;

            _hypernovaClient = new HypernovaClient(logger, env, httpClientFactory, options, siteUrl);

        }

        /// <summary>
        /// Render the SPA application client-side.
        /// </summary>
        /// <remarks>Resulting html wil contain the string: '- ssr:off -'.</remarks>
        /// <param name="relativeUrl">The relative url of the route to show in the SPA, i.e. '/about' (or '/myapp/about' in case of baseAppUrl).</param>
        /// <param name="baseAppUrl">The relative base app url if other than '/', i.e. '/myapp'.</param>
        /// <returns></returns>
        public async Task<SpaSsrResult> RenderSpaClientSide(string relativeUrl, string baseAppUrl = null)
        {
            var indexHtml = await GetIndexHtml();
            var appHtml = BuildPage(indexHtml, null, relativeUrl, baseAppUrl);
            return new SpaSsrResult { Html = appHtml, IsServerSideRendered = false, IsFromCache = false };
        }

        /// <summary>
        /// Render the SPA application client-side.
        /// </summary>
        /// <param name="cacheKey">The key used for caching.</param>
        /// <param name="relativeUrl">The relative url of the route to show in the SPA, i.e. '/about' (or '/myapp/about' in case of baseAppUrl).</param>
        /// <param name="cacheDuration">Cache duration.</param>
        /// <param name="baseAppUrl">The relative base app url if other than '/' (default), i.e. '/myapp'.</param>
        /// <returns>The html of the server-side rendered app, or the client-side html in case of errors</returns>
        public async Task<SpaSsrResult> RenderSpaServerSide(string cacheKey, string relativeUrl, TimeSpan cacheDuration, string baseAppUrl = "/")
        {
            string indexHtml;
            string appHtml;

            if (_settings.NoCaching == false)
            {
                appHtml = await _cache.GetStringAsync(cacheKey);
                // If we have a cache and the rendered version is available in the cache return it, "mark" the ssr as "from cache"
                if (appHtml != null)
                {
                    appHtml = (new System.Text.RegularExpressions.Regex("- ssr -")).Replace(appHtml, "- ssr:cached -", 1);
                    return new SpaSsrResult { Html = appHtml, IsServerSideRendered = true, IsFromCache = true, Exception = null };
                }
            }

            if (_indexHtmlCache == null)
            {
                indexHtml = await GetIndexHtml();
                if (_env.IsProduction())
                {
                    _indexHtmlCache = indexHtml;
                }
            }
            else
            {
                indexHtml = _indexHtmlCache;
            }

            if (_settings.FallbackToClientSideRenderingOnly)
            {
                appHtml = BuildPage(indexHtml, _siteUrl, relativeUrl, baseAppUrl);
                return new SpaSsrResult { Html = appHtml, IsServerSideRendered = false, IsFromCache = false };
            }

            try
            {
                string[] cssUrls;
                string[] jsUrls;
                if (!_cssAndJsUrlsCached)
                {
                    string assetManifestJson = _env.IsProduction() ? await GetAssetManifestJson() : null;
                    (cssUrls, jsUrls) = ParseCra2HtmlForCssAndJs(indexHtml, assetManifestJson);
                    if (_env.IsProduction())
                    {
                        _cssAndJsUrlsCached = true;
                        _cssUrlsCache = cssUrls;
                        _jsUrlsCache = jsUrls;
                    }
                }
                else
                {
                    cssUrls = _cssUrlsCache;
                    jsUrls = _jsUrlsCache;
                }

                var hypernovaResult = await _hypernovaClient.ReactAsyncReduxSpa("pwa:HypernovaApp", cssUrls, jsUrls, relativeUrl, "{}", _siteUrl);
                appHtml = BuildPage(indexHtml, relativeUrl,baseAppUrl, hypernovaResult.ToString());
                if (_settings.NoCaching == false)
                {
                    DateTime absoluteExpiration = DateTime.Now.Add((TimeSpan)cacheDuration);
                    await _cache.SetStringAsync(cacheKey, appHtml, new DistributedCacheEntryOptions { AbsoluteExpiration = absoluteExpiration });
                }
                return new SpaSsrResult { Html = appHtml, IsServerSideRendered = true, IsFromCache = false, Exception = null };
            }
            catch (Exception ex)
            {
                // Logging of exception - why couldn't we do server-side rendering?
                _logger.LogCritical((new Exception($"Hypernova component rendering failed: {ex.Message}", ex)).ToString());

                // fall back to client-side rendering
                appHtml = BuildPage(indexHtml, relativeUrl, baseAppUrl);

                return new SpaSsrResult { Html = appHtml, IsServerSideRendered = false, IsFromCache = false, Exception = new HypernovaException(ex.Message) };
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="appHtml">The prestine app index.html page</param>
        /// <param name="relativeUrl">The relative url of the app page we are rendering</param>
        /// <param name="baseAppUrl">The base url of the app</param>
        /// <param name="hypernovaResult">If null server-side rendering is off</param>
        /// <returns></returns>
        private static string BuildPage(string appHtml, string relativeUrl, string baseAppUrl = null, string hypernovaResult = null)
        {
            StringBuilder endHeadReplacement = new StringBuilder();

            // Only rewrite url on the client if we have a baseAppUrl
            if (baseAppUrl != null && baseAppUrl != "/")
            {
                if (baseAppUrl.EndsWith("/"))
                {
                    baseAppUrl = baseAppUrl.Remove(baseAppUrl.Length - 1);
                }
                var appUrl = baseAppUrl + (relativeUrl == "/" ? "" : relativeUrl);
                endHeadReplacement.Append($"<script>window.history.replaceState({{}}, '', '{appUrl}');</script>");
            }

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
                appHtml = hypernovaResult;
                endHeadReplacement.Append($"<!-- {DateTime.Now.ToString("yyyyMMddHHmmss")} - ssr - -->");
            }

            endHeadReplacement.Append("</head>");

            appHtml = appHtml.Replace("</head>", endHeadReplacement.ToString());

            return appHtml;
        }

        private async Task<string> GetIndexHtml()
        {
            string indexHtml;

            if (_env.IsDevelopment())
            {
                var client = _httpClientFactory.CreateClient();
                var indexHtmlResponse = await client.GetAsync("http://localhost:3000?prestine");
                if (indexHtmlResponse.IsSuccessStatusCode)
                {
                    indexHtml = await indexHtmlResponse.Content.ReadAsStringAsync();
                }
                else
                {
                    throw new HypernovaException($"Failed to read index.html from url 'http://localhost:3000?prestine'");
                }
            }
            else
            {
                var indexHtmlFileInfo = _env.ContentRootFileProvider.GetFileInfo("ClientApp/build/index.html");
                try
                {
                    indexHtml = await File.ReadAllTextAsync(indexHtmlFileInfo.PhysicalPath);
                }
                catch (Exception ex)
                {
                    throw new HypernovaException($"Failed to read index.html from path '{indexHtmlFileInfo.PhysicalPath}'", ex);
                }
            }
            return indexHtml;
        }

        private async Task<string> GetAssetManifestJson()
        {
            if (_env.IsDevelopment())
            {
                return null;
            }
            else
            {
                var assetManifestJsonFileInfo = _env.ContentRootFileProvider.GetFileInfo("ClientApp/build/asset-manifest.json");
                var assetManifestJson = await File.ReadAllTextAsync(assetManifestJsonFileInfo.PhysicalPath);
                return assetManifestJson;
            }
        }

        /// <summary>
        /// Determine the used CSS and JavaScript files for a non-ejected Create React App 2 installation.
        /// </summary>
        /// <remarks>
        /// When CRA2 build the production build/index.html it adds the contents of runtime~main.js inline,
        /// reference the file as a js file.
        /// </remarks>
        /// <param name="indexHtml">Contents of the index.html file to parse.</param>
        /// <param name="assetManifestJson">Contents of the asset-manifest.json file, or null</param>
        /// <returns>A tuple with the found css and js urls.</returns>
        private (string[] CssUrls, string[] JsUrls) ParseCra2HtmlForCssAndJs(string indexHtml, string assetManifestJson)
        {
            var cssUrlsList = new List<string>();
            var jsUrlsList = new List<string>();

            if (!String.IsNullOrWhiteSpace(assetManifestJson))
            {
                var assetManifest = JObject.Parse(assetManifestJson);
                var runtimeMainJsToken = assetManifest["runtime~main.js"];
                if (runtimeMainJsToken != null)
                {
                    jsUrlsList.Add(runtimeMainJsToken.ToString());
                }
            }

            foreach (Match cssMatch in Regex.Matches(indexHtml, @"<link\shref=""([^""]+?)""\srel=""stylesheet""", RegexOptions.IgnoreCase))
            {
                cssUrlsList.Add(cssMatch.Value);
            }
            foreach (Match jsMatch in Regex.Matches(indexHtml, @"<script\ssrc=""([^""]+?)""><\/script>", RegexOptions.IgnoreCase))
            {
                jsUrlsList.Add(jsMatch.Groups[1].Value);
            }

            return (cssUrlsList.ToArray(), jsUrlsList.ToArray());
        }
    }
}