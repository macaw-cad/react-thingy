using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Hosting;

namespace Web.App.HypernovaClient
{
    /// <summary>
    /// Hypernova client.
    /// </summary>
    public class HypernovaController : Controller
    {
        public readonly ILogger<HypernovaController> Logger;
        public readonly IHostingEnvironment Env;
        public readonly IHttpClientFactory HttpClientFactory;
        public readonly IOptions<HypernovaSettings> Options;
        public readonly HypernovaSettings Settings;

        public HypernovaController(ILogger<HypernovaController> logger, IHostingEnvironment env, IHttpClientFactory httpClientFactory, IOptions<HypernovaSettings> options)
        {
            Logger = logger ?? throw new ArgumentNullException(nameof(logger));
            Env = env ?? throw new ArgumentNullException(nameof(env));
            HttpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            Options = options;
            Settings = options.Value;

            //_client = new HttpClient(); // https://aspnetmonsters.com/2016/08/2016-08-27-httpclientwrong/
            //_client.Timeout = TimeSpan.FromMilliseconds(TimeoutInMilliseconds);

            //_hypernovaComponentServerUrl = ConfigurationManager.AppSettings[AppSettingHypernovaComponentServerUrl];
            //if (string.IsNullOrWhiteSpace(_hypernovaComponentServerUrl))
            //{
            //    throw new ConfigurationErrorsException(message: $"Web.config app setting {AppSettingHypernovaComponentServerUrl} not defined or empty.");
            //}
        }

        public string PagesCacheName {
            get
            {
                return Settings.PagesCacheName;
            }
        }

        public IHtmlContent React(
            string componentName,
            string jsonSerializedProps
        )
        {
            if (String.IsNullOrWhiteSpace(jsonSerializedProps))
            {
                jsonSerializedProps = "{}";
            }
            var postBody = $"{{ \"{componentName}\": {{ \"name\": \"{componentName}\", \"data\": {jsonSerializedProps} }} }}";

            return RenderHypernovaComponentsSync(componentName, postBody);
        }

        public IHtmlContent ReactAsyncRedux(
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

            if (String.IsNullOrWhiteSpace(baseUrl))
            {
                var hypernovaComponentServerBaseUrlOverride = Settings.ComponentServerBaseUrlOverride;
                if (!string.IsNullOrWhiteSpace(Settings.ComponentServerBaseUrlOverride))
                {
                    baseUrl = Settings.ComponentServerBaseUrlOverride;
                    if (baseUrl.Contains("[local-ip]"))
                    {
                        baseUrl = baseUrl.Replace("[local-ip]", GetLocalIpAddress());
                    }
                }
                else
                {
                    baseUrl = String.Format("{0}://{1}", HttpContext.Request.Scheme, HttpContext.Request.Host);
                }
            }

            var postBody = $"{{ \"{componentName}\": {{ \"name\": \"{componentName}\", \"data\": {jsonSerializedReduxState}, \"metadata\": {{ \"strategy\": \"asyncRedux\", \"baseUrl\": \"{baseUrl}\", \"timeout\": {Settings.TimeoutInMilliseconds}, \"applicationContextServer\": {{ \"relativeUrl\": \"{relativeUrl}\", \"isAmp\": false }} }} }} }}";

            var result = RenderHypernovaComponentsSync(componentName, postBody);
            return result;
        }

        private IHtmlContent RenderHypernovaComponentsSync(string componentName, string postBody)
        {
            string hypernovaServerUrl;

            if (!Uri.TryCreate(Settings.ComponentServerUrl, UriKind.Absolute, out Uri _))
            {
                var baseUrl = String.Format("{0}://{1}", HttpContext.Request.Scheme, HttpContext.Request.Host);
                hypernovaServerUrl = new Uri(new Uri(baseUrl), relativeUri: Settings.ComponentServerUrl).ToString();
            }
            else
            {
                hypernovaServerUrl = Settings.ComponentServerUrl;
            }
            var client = HttpClientFactory.CreateClient();
            var response = client.PostAsync($"{hypernovaServerUrl}/batch", new StringContent(postBody, System.Text.Encoding.UTF8, "application/json")).Result;
            var responseString = response.Content.ReadAsStringAsync().Result;
            var hypernovaResult = JsonConvert.DeserializeObject<HypernovaResult>(responseString);

            if (hypernovaResult.Succes == false && hypernovaResult.Error != null)
            {
                throw new HypernovaException($"Call to Hypernova component render service at '{hypernovaServerUrl}' failed. Error: {hypernovaResult.Error.Message}");
            }

            var componentResult = hypernovaResult.Results[componentName];

            if (componentResult.StatusCode != 200)
            {
                throw new HypernovaException($"Failed to render component '{componentName}' using the Hypernova component render service at '{hypernovaServerUrl}'. Error: {componentResult.Error.Message}, Stacktrace: {string.Join("\r\n", componentResult.Error.Stack)}");
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

    public class HypernovaResult
    {
        public bool Succes;
        public HypernovaError Error;
        public Dictionary<string, HypernovaComponent> Results;


        public class HypernovaError
        {
            public string Name;
            public string Message;
            public string[] Stack;
        }

        public class HypernovaComponent
        {
            public string Name;
            public string Html;
            // ?? meta
            public double? Duration; // in ms
            public int StatusCode;
            public bool Success;
            public HypernovaError Error;
        }
    }
}