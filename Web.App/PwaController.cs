using System.Net.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Web.App.HypernovaClient;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Web.App
{
    public class PwaController : HypernovaController
    {
        private readonly HypernovaFileCache _hypernovaFileCache;
        private readonly Renderer _renderer;
        private readonly string _indexHtmlFile;

        public PwaController(ILogger<HypernovaController> logger, IHttpClientFactory httpClientFactory, IHostingEnvironment env, IOptions<HypernovaSettings> options)
            : base(logger, env, httpClientFactory, options)
        {
            _hypernovaFileCache = new HypernovaFileCache(logger as ILogger<HypernovaFileCache>, env, options);
            _renderer = new Renderer(logger as ILogger<Renderer>, options);
            _indexHtmlFile = System.IO.Path.Combine(env.WebRootPath, "ClientApp\\build\\index.html");
        }

        public ActionResult Article(int id)
        {
            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}";
            var relativeUrl = $"{HttpContext.Request.Path}{HttpContext.Request.QueryString}";
            var cacheItemName = $"article_{id.ToString()}";

            ActionResult result = _hypernovaFileCache.GetCachedActionResult(this, PagesCacheName, cacheItemName);
            if (result != null)
            {
                return result;
            }

            var renderData = new RenderData
            {
                Title = "Campingthema&#39;s - ANWB camping",
                MetaData = new MetaData[]
                {
                                new MetaData { Name = "description", Content = "Vind je volgende camping gemakkelijk en snel via een van onze campingthema&#39;s. Zoek o.a. op charmecamping, kleine camping en kindercamping." }
                },
                CanonicalUrl = $"{baseUrl}{relativeUrl}"
            };


            var renderResult = _renderer.RenderAppServerSide(this, _indexHtmlFile, relativeUrl, renderData, "/", null);
            if (renderResult.IsServerSideRendered)
            {
                result = _hypernovaFileCache.StoreAndGetActionResult(this, PagesCacheName, cacheItemName, renderResult.Html);
                return result;
            }
            else
            {
                var clientRenderResult = new ContentResult();
                clientRenderResult.Content = renderResult.Html; // render client-side
                // TODO: depricated? result.ContentEncoding = System.Text.Encoding.UTF8;
                clientRenderResult.ContentType = "text/html";
                return clientRenderResult;
            }
        }
    }
}

