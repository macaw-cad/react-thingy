using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Web.App.Hypernova;

namespace Web.App
{
    public class PwaController : Controller
    {
        private readonly HypernovaClient _hypernovaClient;
        private readonly SpaSsr _spaSsr;

        public PwaController(ILogger<PwaController> logger, IHttpClientFactory httpClientFactory, IHostingEnvironment env, IOptions<HypernovaSettings> options, IDistributedCache cache)
        {
            var settings = options.Value;
            _hypernovaClient = new HypernovaClient(logger, env, httpClientFactory, options);
            _spaSsr = new SpaSsr(logger, env, httpClientFactory, options, cache);
        }

        public async Task<ActionResult> Index()
        {
            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}";
            var relativeUrl = $"{HttpContext.Request.Path}{HttpContext.Request.QueryString}";

            var renderData = new SpaSsrData
            {
                Title = "React SSR",
                MetaData = new SpaSsrMetaData[]
                {
                    new SpaSsrMetaData { Name = "description", Content = "A simple example of a server-side rendered React Progressive Web App." }
                },
                CanonicalUrl = $"{baseUrl}{relativeUrl}"
            };

            var renderResult = await _spaSsr.RenderAppServerSide(_hypernovaClient, relativeUrl, renderData, TimeSpan.FromDays(1.0), "/");
            var content = new ContentResult
            {
                Content = renderResult.Html,
                ContentType = "text/html"
            };
            return content;
        }
    }
}

