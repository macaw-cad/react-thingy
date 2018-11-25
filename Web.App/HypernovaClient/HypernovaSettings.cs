using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Web.App.HypernovaClient
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
        public static void AddHypernovaSettings(this IServiceCollection services, IConfiguration config)
        {
            services
                .AddOptions()
                .Configure<HypernovaSettings>(config.GetSection(HypernovaSettings.SettingsName));
        }
    }
}
