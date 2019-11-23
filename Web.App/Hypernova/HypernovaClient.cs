using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Hosting;
using System.Threading.Tasks;

namespace Web.App.Hypernova
{
    /// <summary>
    /// Hypernova client.
    /// </summary>
    public class HypernovaClient
    {
        private readonly ILogger _logger;
        private readonly IHostingEnvironment _env;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IOptions<HypernovaSettings> _options;
        private readonly HypernovaSettings _settings;
        private readonly string _siteUrl;

        public HypernovaClient(ILogger logger, IHostingEnvironment env, IHttpClientFactory httpClientFactory, IOptions<HypernovaSettings> options, string siteUrl)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _env = env ?? throw new ArgumentNullException(nameof(env));
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _options = options ?? throw new ArgumentNullException(nameof(logger));
            _settings = options.Value;
            _siteUrl = siteUrl;
        }

        /// <summary>
        /// Render a React component server-side given the props serialized in <paramref name="jsonSerializedProps"/>.
        /// </summary>
        /// <param name="componentName">The name of the React component.</param>
        /// <param name="jsonSerializedProps">Serialized component props.</param>
        /// <returns></returns>
        public async Task<IHtmlContent> React(
            string componentName,
            string jsonSerializedProps
        )
        {
            if (String.IsNullOrWhiteSpace(jsonSerializedProps))
            {
                jsonSerializedProps = "{}";
            }

            var postBody = $"{{ \"{componentName}\": {{ \"name\": \"{componentName}\", \"data\": {jsonSerializedProps} }} }}";

            var result = await RenderHypernovaComponents(componentName, postBody);
            return result;
        }

        /// <summary>
        /// Render a React component server-side with an initial Redux state and support for async calls using the Hypernova Component Server.
        /// </summary>
        /// <param name="componentName">The name of the React component.</param>
        /// <param name="relativeUrl">The relative url, useful in case of rendering a React component with routing.</param>
        /// <param name="jsonSerializedReduxState">The initial Redux state to start with.</param>
        /// <param name="baseUrl">The base url of the website for prefixing relative ajax calls. If not
        /// explicitly specified it can be configured with the <c>ComponentServerBaseUrlOverride</c> appsetting.</param>
        /// <returns>The resulting server-side rendered HTML.</returns>
        public async Task<IHtmlContent> ReactAsyncRedux(
            string componentName,
            string relativeUrl = "",
            string jsonSerializedReduxState = null,
            string baseUrl = null
        )
        {
            if (String.IsNullOrWhiteSpace(jsonSerializedReduxState))
            {
                jsonSerializedReduxState = "{}";
            }

            baseUrl = ResolveBaseUrl(baseUrl);

            var postBody = $"{{ \"{componentName}\": {{ \"name\": \"{componentName}\", \"data\": {jsonSerializedReduxState}, \"metadata\": {{ \"strategy\": \"asyncRedux\", \"baseUrl\": \"{baseUrl}\", \"timeout\": {_settings.TimeoutInMilliseconds}, \"applicationContextServer\": {{ \"relativeUrl\": \"{relativeUrl}\", \"cssUrls\": [], \"jsUrls\": [], \"isAmp\": false }} }} }} }}";

            var result = await RenderHypernovaComponents(componentName, postBody);
            return result;
        }

        /// <summary>
        /// Render a React SPA application server-side with an initial Redux state and support for async calls using the Hypernova Component Server.
        /// This function can server-side render a complete SPA React application.
        /// </summary>
        /// <param name="componentName">The name of the React component.</param>
        /// <param name="relativeUrl">The relative url, useful in case of rendering a SPA React application with routing.</param>
        /// <param name="cssUrls">CSS urls to be included in the head.</param>
        /// <param name="jsUrls">JavaScript urls to be included at the end of the body.</param>
        /// <param name="jsonSerializedReduxState">The initial Redux state to start with.</param>
        /// <param name="baseUrl">The base url of the website for prefixing relative ajax calls. If not
        /// explicitly specified it can be configured with the <c>ComponentServerBaseUrlOverride</c> appsetting.</param>
        /// <returns>The resulting server-side rendered HTML - this must be a complete HTML page.</returns>
        public async Task<IHtmlContent> ReactAsyncReduxSpa(
            string componentName,
            string[] cssUrls,
            string[] jsUrls,
            string relativeUrl = "",
            string jsonSerializedReduxState = null,
            string baseUrl = null
        )
        {
            if (String.IsNullOrWhiteSpace(jsonSerializedReduxState))
            {
                jsonSerializedReduxState = "{}";
            }

            baseUrl = ResolveBaseUrl(baseUrl);

            var postBody = $"{{ \"{componentName}\": {{ \"name\": \"{componentName}\", \"data\": {jsonSerializedReduxState}, \"metadata\": {{ \"strategy\": \"asyncRedux\", \"baseUrl\": \"{baseUrl}\", \"timeout\": {_settings.TimeoutInMilliseconds}, \"applicationContextServer\": {{ \"relativeUrl\": \"{relativeUrl}\", \"cssUrls\": {JsonConvert.SerializeObject(cssUrls)}, \"jsUrls\": {JsonConvert.SerializeObject(jsUrls)}, \"isAmp\": false }} }} }} }}";

            var result = await RenderHypernovaComponents(componentName, postBody);
            return result;
        }

        private string ResolveBaseUrl(string baseUrl)
        {
            if (String.IsNullOrWhiteSpace(baseUrl))
            {
                var hypernovaComponentServerBaseUrlOverride = _settings.ComponentServerBaseUrlOverride;
                if (!string.IsNullOrWhiteSpace(_settings.ComponentServerBaseUrlOverride))
                {
                    baseUrl = _settings.ComponentServerBaseUrlOverride;
                    if (baseUrl.Contains("[local-ip]"))
                    {
                        baseUrl = baseUrl.Replace("[local-ip]", GetLocalIpAddress());
                    }
                }
            }

            return baseUrl;
        }

        private async Task<IHtmlContent> RenderHypernovaComponents(string componentName, string postBody)
        {
            string hypernovaServerUrl = _settings.ComponentServerUrl;

            if (!Uri.IsWellFormedUriString(_settings.ComponentServerUrl, UriKind.Absolute))
            {
                hypernovaServerUrl = $"{_siteUrl}{hypernovaServerUrl}";
                // throw new HypernovaException($"Hypernova Component Server url '{hypernovaServerUrl}' as specified in appsetting 'Hypernova.' is not an absolute url");
            }

			var responseString = "";

			try
			{
                _logger.LogInformation($"URL: {hypernovaServerUrl}/batch, POSTBODY: {postBody}");
				var client = _httpClientFactory.CreateClient();
				var response = await client.PostAsync($"{hypernovaServerUrl}/batch", new StringContent(postBody, System.Text.Encoding.UTF8, "application/json"));
				responseString = await response.Content.ReadAsStringAsync();
			} catch(Exception e) {
				throw new HypernovaException($"Post to Hypernova Component Server at '{hypernovaServerUrl}/batch' failed. Error: {e.Message}");
			}
			
			var hypernovaResult = JsonConvert.DeserializeObject<HypernovaResult>(responseString);
			
            if (hypernovaResult.Succes == false && hypernovaResult.Error != null)
            {
                throw new HypernovaException($"Call to Hypernova Component Server at '{hypernovaServerUrl}' failed. Error: {hypernovaResult.Error.Message}");
            }

            var componentResult = hypernovaResult.Results[componentName];

            if (componentResult.StatusCode != 200)
            {
                throw new HypernovaException($"Failed to render component '{componentName}' using the Hypernova Component Server at '{hypernovaServerUrl}'. Error: {componentResult.Error?.Message}, Stacktrace: {(componentResult.Error != null ? string.Join("\r\n", componentResult.Error.Stack) : "")}");
            }

            return new HtmlString(hypernovaResult.Results[componentName].Html);
        }

        // https://stackoverflow.com/questions/6803073/get-local-ip-address (rodcesar.santos)
        private static string GetLocalIpAddress()
        {
            UnicastIPAddressInformation mostSuitableIp = null;

            var networkInterfaces = NetworkInterface.GetAllNetworkInterfaces();

            foreach (var network in networkInterfaces)
            {
                if (network.OperationalStatus != OperationalStatus.Up)
                    continue;

                var properties = network.GetIPProperties();

                if (properties.GatewayAddresses.Count == 0)
                    continue;

                foreach (var address in properties.UnicastAddresses)
                {
                    if (address.Address.AddressFamily != AddressFamily.InterNetwork)
                        continue;

                    if (IPAddress.IsLoopback(address.Address))
                        continue;

                    if (!address.IsDnsEligible)
                    {
                        if (mostSuitableIp == null)
                            mostSuitableIp = address;
                        continue;
                    }

                    // The best IP is the IP got from DHCP server
                    if (address.PrefixOrigin != PrefixOrigin.Dhcp)
                    {
                        if (mostSuitableIp == null || !mostSuitableIp.IsDnsEligible)
                            mostSuitableIp = address;
                        continue;
                    }

                    return address.Address.ToString();
                }
            }

            return mostSuitableIp != null
                ? mostSuitableIp.Address.ToString()
                : "";
        }
    }
}