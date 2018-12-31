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
    public class SpaSsrController : Controller
    {
        private readonly SpaSsr _spaSsr;

        public SpaSsrController(ILogger<SpaSsrController> logger, IHttpClientFactory httpClientFactory, IHostingEnvironment env, IOptions<HypernovaSettings> options, IDistributedCache cache)
        {
            _spaSsr = new SpaSsr(logger, env, httpClientFactory, options, cache);
        }

        public async Task<ActionResult> Index()
        {
            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}";
            var relativeUrl = $"{HttpContext.Request.Path}{HttpContext.Request.QueryString}";

            var renderResult = await _spaSsr.RenderSpaServerSide(baseUrl, relativeUrl, TimeSpan.FromDays(1.0));
            var content = new ContentResult
            {
                Content = renderResult.Html,
                ContentType = "text/html"
            };
            return content;
        }
    }
}

