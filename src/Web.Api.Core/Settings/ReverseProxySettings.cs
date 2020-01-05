using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;

namespace Web.Api.Core.Settings
{
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
        public static void AddReverseProxySettings(
            this IServiceCollection services, IConfiguration config)
        {
            services
                .AddOptions()
                .Configure<ReverseProxySettings>(options => config.GetSection(ReverseProxySettings.SettingsName).Bind(options));
        }
    }
}

