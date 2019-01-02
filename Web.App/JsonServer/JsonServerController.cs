using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Threading;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;

namespace Web.App.JsonServer
{
    public class JsonServerController : Controller
    {
        public readonly ILogger Logger;
        public readonly IHostingEnvironment Env;
        public readonly IHttpClientFactory HttpClientFactory;
        public readonly IOptions<JsonServerSettings> Options;
        public readonly JsonServerSettings Settings;

        public JsonServerController(ILogger<JsonServerController> logger, IHttpClientFactory httpClientFactory, IHostingEnvironment env, IOptions<JsonServerSettings> options)
        {
            Logger = logger ?? throw new ArgumentNullException(nameof(logger));
            Env = env ?? throw new ArgumentNullException(nameof(env));
            HttpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            Options = options;
            Settings = options.Value;
        }

        /// <summary>
        /// Execute an JsonServer query.
        /// </summary>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>The response from jsonserver.</returns>
 
        [HttpPost]
        [HttpGet]
        [Route("mockapi/{**jsonServerRequest}")]
        public async Task<IActionResult> JsonServer(string jsonServerRequest, CancellationToken cancellationToken)
        {
            string jsonServerUrl = Settings.Url;

            if (!Uri.TryCreate(Settings.Url, UriKind.Absolute, out Uri _))
            {
                throw new JsonServerException($"JsonServer url '{jsonServerUrl}' as specified in appsetting 'JsonServer' is not an absolute url");
            }
            var client = HttpClientFactory.CreateClient();
            var clonedRequest = this.Request.ToHttpRequestMessage();
            clonedRequest.RequestUri = new Uri($"{jsonServerUrl}/{jsonServerRequest}");
            HttpResponseMessage result;
            try
            {
                result = await client.SendAsync(clonedRequest, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
            } catch(HttpRequestException ex)
            {
                return new BadRequestObjectResult(new { status = false, message = "Is JsonServer running? " + ex.ToString() });
            }
            var content = await result.Content.ReadAsStringAsync();
            return Content(content);
        }
    }
}
