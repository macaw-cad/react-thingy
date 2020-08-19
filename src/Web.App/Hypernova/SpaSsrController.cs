using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Web.App.Hypernova;

namespace Web.App
{
    public class SpaSsrController : Controller
    {
        private readonly ILogger _logger;
        private readonly IWebHostEnvironment _env;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IOptions<HypernovaSettings> _options;
        private readonly IDistributedCache _cache;

		private SpaSsr _spaSsr = null;

        public SpaSsrController(ILogger<SpaSsrController> logger, IHttpClientFactory httpClientFactory, IWebHostEnvironment env, IOptions<HypernovaSettings> options, IDistributedCache cache, IConfiguration configuration)
        {
            if (configuration is null)
            {
                throw new ArgumentNullException(nameof(configuration));
            }

            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _env = env ?? throw new ArgumentNullException(nameof(env));
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _options = options ?? throw new ArgumentNullException(nameof(options));
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
		}

        public async Task<ActionResult> Index()
        {
			if (_spaSsr == null)
			{
				bool isHttps = HttpContext.Request.Headers["X-Forwarded-Proto"] == "https" || HttpContext.Request.IsHttps;
				string protocol = isHttps ? "https" : "http";
				string host = HttpContext.Request.Host.ToString();

				if (HttpContext.Request.Headers.ContainsKey("X-ORIGINAL-HOST")) {
					host = HttpContext.Request.Headers["X-ORIGINAL-HOST"];
				}

				var siteUrl = $"{protocol}://{host}";
				_spaSsr = new SpaSsr(_logger, _env, _httpClientFactory, _options, _cache, siteUrl);

			}

            var cacheKey = HttpContext.Request.Path.ToString().ToUpperInvariant();
            var relativeUrl = $"{HttpContext.Request.Path}{HttpContext.Request.QueryString}";

            var renderResult = await _spaSsr.RenderSpaServerSide(cacheKey, relativeUrl, TimeSpan.FromDays(1.0));
            var content = new ContentResult
            {
                Content = renderResult.Html,
                ContentType = "text/html"
            };

			if (renderResult.StatusCode.HasValue)
			{
				content.StatusCode = (int)renderResult.StatusCode.Value;
			}

			return content;
        }
    }
}

