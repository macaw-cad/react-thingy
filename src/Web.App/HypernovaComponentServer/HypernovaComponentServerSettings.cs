using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Web.App.HypernovaComponentServer
{
    public sealed class HypernovaComponentServerSettings
    {
        internal const string SettingsName = "HypernovaComponentServer";

        public string Url { get; set; }
    }

    public static class HypernovaComponentServerExtensions
    {
        /// <summary>
        /// Startup config extension method.
        /// </summary>
        /// <param name="services">this/services. Must not be null.</param>
        /// <param name="config">The Configuration the Startup class was constructed with. Must not be null.</param>
        public static void AddHypernovaComponentServerSettings(this IServiceCollection services, IConfiguration config)
        {
            if (config == null) throw new ArgumentNullException(nameof(config));
            services
                .AddOptions()
                .Configure<HypernovaComponentServerSettings>(config.GetSection(HypernovaComponentServerSettings.SettingsName));
        }
    }
}
