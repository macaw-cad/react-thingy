using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Web.App.Hypernova
{
    public sealed class HypernovaSettings
    {
        internal const string SettingsName = "Hypernova";

        public string ComponentServerUrl { get; set; }
        public int TimeoutInMilliseconds { get; set; }
        public bool FallbackToClientSideRenderingOnly { get; set; }
        public bool DisableFileCache { get; set; }
        public string ComponentServerBaseUrlOverride { get; set; }
        public string PagesCacheName { get; set; }
        public string AmpPagesCacheName { get; set; }
    }

    public static class HypernovaExtensions
    {
        /// <summary>
        /// Startup config extension method.
        /// </summary>
        /// <param name="services">this/services. Must not be null.</param>
        /// <param name="config">The Configuration the Startup class was constructed with. Must not be null.</param>
        public static void AddHypernovaSettings(this IServiceCollection services, IConfiguration config)
        {
            services
                .AddOptions()
                .Configure<HypernovaSettings>(config.GetSection(HypernovaSettings.SettingsName));
        }
    }
}
