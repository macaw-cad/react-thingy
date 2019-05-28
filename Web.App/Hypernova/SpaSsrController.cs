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
        private readonly IHostingEnvironment _env;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IOptions<HypernovaSettings> _options;
        private readonly HypernovaSettings _settings;
        private readonly IDistributedCache _cache;
		private readonly IConfiguration _configuration;

		private SpaSsr _spaSsr = null;

        public SpaSsrController(ILogger<SpaSsrController> logger, IHttpClientFactory httpClientFactory, IHostingEnvironment env, IOptions<HypernovaSettings> options, IDistributedCache cache, IConfiguration configuration)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _env = env ?? throw new ArgumentNullException(nameof(env));
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _options = options;
            _settings = options.Value;
            _cache = cache;
			_configuration = configuration;
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
				_spaSsr = new SpaSsr(_logger, _env, _httpClientFactory, _options, _cache, siteUrl, _configuration, HttpContext);

			}

            var cacheKey = HttpContext.Request.Path.ToString().ToLowerInvariant();
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

