using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Threading;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;

namespace Web.App.HypernovaComponentServer
{
    public class HypernovaComponentServerController : Controller
    {
        private readonly ILogger _logger;
        private readonly IHostingEnvironment _env;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IOptions<HypernovaComponentServerSettings> _options;
        private readonly HypernovaComponentServerSettings _settings;

        public HypernovaComponentServerController(ILogger<HypernovaComponentServerController> logger, IHttpClientFactory httpClientFactory, IHostingEnvironment env, IOptions<HypernovaComponentServerSettings> options)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _env = env ?? throw new ArgumentNullException(nameof(env));
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _options = options;
            _settings = options.Value;
        }

        /// <summary>
        /// Execute a HypernovaComponentServer action.
        /// </summary>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>The response from HypernovaComponentServer.</returns>
 
        [HttpPost]
        [HttpGet]
        [Route("componentserver/{**hypernovaComponentServerRequest}")]
        public async Task<IActionResult> Hypernova(string hypernovaComponentServerRequest, CancellationToken cancellationToken)
        {
            string hypernovaComponentServerUrl = _settings.Url;

            if (!Uri.TryCreate(_settings.Url, UriKind.Absolute, out Uri _))
            {
                throw new HypernovaComponentServerException($"HypernovaComponentServer url '{hypernovaComponentServerUrl}' as specified in appsetting 'HypernovaComponentServer' is not an absolute url");
            }
            var client = _httpClientFactory.CreateClient();
            var clonedRequest = this.Request.ToHttpRequestMessage();
            clonedRequest.RequestUri = new Uri($"{hypernovaComponentServerUrl}/{hypernovaComponentServerRequest}");
            HttpResponseMessage result;
            try
            {
                result = await client.SendAsync(clonedRequest, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
            } catch(HttpRequestException ex)
            {
                return new BadRequestObjectResult(new { status = false, message = "Is HypernovaComponentServer running? " + ex.ToString() });
            }
            var content = await result.Content.ReadAsStringAsync();
            return Content(content);
        }
    }
}
