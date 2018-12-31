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
        public readonly ILogger Logger;
        public readonly IHostingEnvironment Env;
        public readonly IHttpClientFactory HttpClientFactory;
        public readonly IOptions<HypernovaComponentServerSettings> Options;
        public readonly HypernovaComponentServerSettings Settings;

        public HypernovaComponentServerController(ILogger<HypernovaComponentServerController> logger, IHttpClientFactory httpClientFactory, IHostingEnvironment env, IOptions<HypernovaComponentServerSettings> options)
        {
            Logger = logger ?? throw new ArgumentNullException(nameof(logger));
            Env = env ?? throw new ArgumentNullException(nameof(env));
            HttpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            Options = options;
            Settings = options.Value;
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
            string hypernovaComponentServerUrl = Settings.Url;

            if (!Uri.TryCreate(Settings.Url, UriKind.Absolute, out Uri _))
            {
                throw new HypernovaComponentServerException($"HypernovaComponentServer url '{hypernovaComponentServerUrl}' as specified in appsetting 'HypernovaComponentServer' is not an absolute url");
            }
            var client = HttpClientFactory.CreateClient();
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
