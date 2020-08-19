using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Web.App.Middleware
{
    /// <summary>
    /// Reverse proxy middleware adapted from https://auth0.com/blog/building-a-reverse-proxy-in-dot-net-core/ (github: https://github.com/andychiare/netcore2-reverse-proxy)
    /// </summary>
    public class ReverseProxyMiddleware
    {
        private static readonly HttpClient _httpClient = new HttpClient();
        private readonly RequestDelegate _next;
        private readonly List<ReverseProxyConfiguration> _reverseProxyConfigurations = new List<ReverseProxyConfiguration>();

        public ReverseProxyMiddleware(RequestDelegate next, IOptions<ReverseProxySettings> reverseProxySettings)
        {
            _next = next;

            if (reverseProxySettings != null && reverseProxySettings.Value != null && reverseProxySettings.Value.Configurations != null && reverseProxySettings.Value.Configurations.Count > 0)
            {
                foreach (var reverseProxyConfiguration in reverseProxySettings.Value.Configurations)
                {
                    var parts = reverseProxyConfiguration.Split("=>");
                    if (parts.Length == 2)
                    {
                        _reverseProxyConfigurations.Add(new ReverseProxyConfiguration
                        {
                            StartsWith = parts[0].Trim(),
                            ProxyToUrl = parts[1].Trim()
                        });
                    }
                }
            }
        }

        public async Task Invoke(HttpContext context)
        {
            var targetUri = BuildTargetUri(context.Request);

            if (targetUri != null)
            {
                var targetRequestMessage = CreateTargetMessage(context, targetUri);

                using (var responseMessage = await _httpClient.SendAsync(targetRequestMessage, HttpCompletionOption.ResponseHeadersRead, context.RequestAborted))
                {
                    context.Response.StatusCode = (int)responseMessage.StatusCode;

                    CopyFromTargetResponseHeaders(context, responseMessage);

                    await ProcessResponseContent(context, responseMessage);
                }

                return;
            }

            await _next(context);
        }

        private async Task ProcessResponseContent(HttpContext context, HttpResponseMessage responseMessage)
        {
            var content = await responseMessage.Content.ReadAsByteArrayAsync();
            await context.Response.Body.WriteAsync(content);
        }

        private bool IsContentOfType(HttpResponseMessage responseMessage, string type)
        {
            var result = false;

            if (responseMessage.Content?.Headers?.ContentType != null)
            {
                result = responseMessage.Content.Headers.ContentType.MediaType == type;
            }

            return result;
        }

        private HttpRequestMessage CreateTargetMessage(HttpContext context, Uri targetUri)
        {
            var requestMessage = new HttpRequestMessage();
            CopyFromOriginalRequestContentAndHeaders(context, requestMessage);

            requestMessage.RequestUri = targetUri;
            requestMessage.Headers.Host = targetUri.Host;
            requestMessage.Method = GetMethod(context.Request.Method);

            return requestMessage;
        }

        private void CopyFromOriginalRequestContentAndHeaders(HttpContext context, HttpRequestMessage requestMessage)
        {
            var requestMethod = context.Request.Method;

            if (!HttpMethods.IsGet(requestMethod) &&
                !HttpMethods.IsHead(requestMethod) &&
                !HttpMethods.IsDelete(requestMethod) &&
                !HttpMethods.IsTrace(requestMethod))
            {
                var streamContent = new StreamContent(context.Request.Body);
                requestMessage.Content = streamContent;
            }

            foreach (var header in context.Request.Headers)
            {
                requestMessage.Content?.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
            }
        }

        private void CopyFromTargetResponseHeaders(HttpContext context, HttpResponseMessage responseMessage)
        {
            foreach (var header in responseMessage.Headers)
            {
                context.Response.Headers[header.Key] = header.Value.ToArray();
            }

            foreach (var header in responseMessage.Content.Headers)
            {
                context.Response.Headers[header.Key] = header.Value.ToArray();
            }
            context.Response.Headers.Remove("transfer-encoding");
        }
        private static HttpMethod GetMethod(string method)
        {
            if (HttpMethods.IsDelete(method)) return HttpMethod.Delete;
            if (HttpMethods.IsGet(method)) return HttpMethod.Get;
            if (HttpMethods.IsHead(method)) return HttpMethod.Head;
            if (HttpMethods.IsOptions(method)) return HttpMethod.Options;
            if (HttpMethods.IsPost(method)) return HttpMethod.Post;
            if (HttpMethods.IsPut(method)) return HttpMethod.Put;
            if (HttpMethods.IsTrace(method)) return HttpMethod.Trace;
            return new HttpMethod(method);
        }

        private Uri BuildTargetUri(HttpRequest request)
        {
            PathString remainingPath;

            foreach (var reverseProxyConfiguration in this._reverseProxyConfigurations)
            {
                if (request.Path.StartsWithSegments(reverseProxyConfiguration.StartsWith, out remainingPath))
                {
                    return new Uri(reverseProxyConfiguration.ProxyToUrl + remainingPath + request.QueryString.ToString());
                }
            }

            return null;
        }

        class ReverseProxyConfiguration
        {
            public string StartsWith { get; set; }
            public string ProxyToUrl { get; set; }
        }
    }

    public sealed class ReverseProxySettings
    {
        internal const string SettingsName = "ReverseProxy";

        /// <summary>
        /// Configurations is an array in the format:
        /// <code>
        ///     "Configurations": [
        ///         "/api/forms/form/=>https://localhost:7001/api/forms/form/"
        ///     ]
        /// </code>
        /// </summary>
        public List<string> Configurations { get; set; }
    }

    public static class ReverseProxyExtensions
    {
        public static void AddReverseProxySettings(this IServiceCollection services, IConfiguration config)
        {
            services
                .AddOptions()
                .Configure<ReverseProxySettings>(options => config.GetSection(ReverseProxySettings.SettingsName).Bind(options));
        }
    }
}
