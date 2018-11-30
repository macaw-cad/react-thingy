using System.Net.Http;
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
        private readonly string _pagesCacheName;
        private readonly SpaSsr _spaSsr;
        private readonly string _indexHtmlFile;

        public PwaController(ILogger<HypernovaController> logger, IHttpClientFactory httpClientFactory, IHostingEnvironment env, IOptions<HypernovaSettings> options)
        {
            var settings = options.Value;
            _hypernovaClient = new HypernovaClient(logger, env, httpClientFactory, options);
            _hypernovaFileCache = new HypernovaFileCache(logger, env, options);
            _pagesCacheName = settings.PagesCacheName;
            _spaSsr = new SpaSsr(logger, options);
            _indexHtmlFile = System.IO.Path.Combine(env.WebRootPath, "ClientApp\\build\\index.html");
        }

        public ActionResult Article(int id)
        {
            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}";
            var relativeUrl = $"{HttpContext.Request.Path}{HttpContext.Request.QueryString}";
            var cacheItemName = $"article_{id.ToString()}";

            ActionResult result = _hypernovaFileCache.GetCachedActionResult(this, _pagesCacheName, cacheItemName);
            if (result != null)
            {
                return result;
            }

            var renderData = new SpaSsrData
            {
                Title = "Campingthema&#39;s - ANWB camping",
                MetaData = new SpaSsrMetaData[]
                {
                    new SpaSsrMetaData { Name = "description", Content = "Vind je volgende camping gemakkelijk en snel via een van onze campingthema&#39;s. Zoek o.a. op charmecamping, kleine camping en kindercamping." }
                },
                CanonicalUrl = $"{baseUrl}{relativeUrl}"
            };

            var renderResult = _spaSsr.RenderAppServerSide(_hypernovaClient, _indexHtmlFile, relativeUrl, renderData, "/", null);
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

