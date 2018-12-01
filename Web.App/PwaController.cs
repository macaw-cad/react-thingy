using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Web.App.Hypernova;

namespace Web.App
{
    public class PwaController : Controller
    {
        private readonly HypernovaClient _hypernovaClient;
        private readonly HypernovaFileCache _hypernovaFileCache;
        private readonly string _contentRoot;
        private readonly string _pagesCacheName;
        private readonly SpaSsr _spaSsr;
        private readonly string _indexHtmlFile;

        public PwaController(ILogger<PwaController> logger, IHttpClientFactory httpClientFactory, IHostingEnvironment env, IOptions<HypernovaSettings> options)
        {
            var settings = options.Value;
            _hypernovaClient = new HypernovaClient(logger, env, httpClientFactory, options);
            _hypernovaFileCache = new HypernovaFileCache(logger, env, options);
            _contentRoot = env.ContentRootPath;
            _pagesCacheName = settings.PagesCacheName;
            _spaSsr = new SpaSsr(logger, options);
            _indexHtmlFile = System.IO.Path.Combine(_contentRoot, "ClientApp\\build\\index.html");
        }

        public async Task<ActionResult> Example()
        {
            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}";
            var relativeUrl = $"{HttpContext.Request.Path}{HttpContext.Request.QueryString}";
            var cacheItemName = $"pwa_example";

            ActionResult result = _hypernovaFileCache.GetCachedActionResult(this, _pagesCacheName, cacheItemName);
            if (result != null)
            {
                return result;
            }

            var renderData = new SpaSsrData
            {
                Title = "React SSR",
                MetaData = new SpaSsrMetaData[]
                {
                    new SpaSsrMetaData { Name = "description", Content = "A simple example of a server-side rendered React Progressive Web App." }
                },
                CanonicalUrl = $"{baseUrl}{relativeUrl}"
            };

            var renderResult = await _spaSsr.RenderAppServerSide(_hypernovaClient, _indexHtmlFile, relativeUrl, renderData, "/", null);
            if (renderResult.IsServerSideRendered)
            {
                result = _hypernovaFileCache.StoreAndGetActionResult(this, _pagesCacheName, cacheItemName, renderResult.Html);
                return result;
            }
            else
            {
                var clientRenderResult = new ContentResult();
                clientRenderResult.Content = renderResult.Html; // render client-side
                clientRenderResult.ContentType = "text/html";
                return clientRenderResult;
            }
        }
    }
}

