using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Threading;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text;

namespace Web.App.JsonServer
{
    public class JsonServerController : Controller
    {
        private readonly ILogger _logger;
        private readonly IHostingEnvironment _env;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IOptions<JsonServerSettings> _options;
        private readonly JsonServerSettings _settings;

        public JsonServerController(ILogger<JsonServerController> logger, IHttpClientFactory httpClientFactory, IHostingEnvironment env, IOptions<JsonServerSettings> options)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _env = env ?? throw new ArgumentNullException(nameof(env));
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _options = options;
            _settings = options.Value;
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
            string jsonServerUrl = _settings.Url;

            if (!Uri.TryCreate(_settings.Url, UriKind.Absolute, out Uri _))
            {
                throw new JsonServerException($"JsonServer url '{jsonServerUrl}' as specified in appsetting 'JsonServer' is not an absolute url");
            }
            var client = _httpClientFactory.CreateClient();
            // TODO: this fails! var clonedRequest = this.Request.ToHttpRequestMessage();
            var clonedRequest = new HttpRequestMessage(new HttpMethod(Request.Method), "{jsonServerUrl}/{jsonServerRequest}");
            clonedRequest.RequestUri = new Uri($"{jsonServerUrl}/{jsonServerRequest}");
            clonedRequest.Content = new StreamContent(Request.Body);

            HttpResponseMessage result;
            try
            {

                result = await client.SendAsync(clonedRequest, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
            } catch(HttpRequestException ex)
            {
                return new BadRequestObjectResult(new { status = false, message = "Is JsonServer running? " + ex.ToString() });
            }
            var content = await result.Content.ReadAsStringAsync();
            if (jsonServerRequest == "main.js") {
                content = content.Replace("fetch(\"db\")", "fetch(\"/mockapi/db\")");
            }
            if (String.IsNullOrEmpty(jsonServerRequest))
            {
                // root is html page - current replacements is for default implementation
                content = content.Replace("\"main.css\"", "\"/mockapi/main.css\"");
                content = content.Replace("\"favicon.ico\"", "\"/mockapi/favicon.ico\"");
                content = content.Replace("\"main.js\"", "\"/mockapi/main.js\"");
                content = content.Replace("<head>", "<head><base href=\"/mockapi/\" />");
            }
            return Content(content, result.Content.Headers.ContentType.ToString());
        }
    }
}
