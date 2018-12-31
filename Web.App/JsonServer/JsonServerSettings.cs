using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Web.App.JsonServer
{
    public sealed class JsonServerSettings
    {
        internal const string SettingsName = "JsonServer";

        public string JsonServerUrl { get; set; }
    }

    public static class JsonServerExtensions
    {
        /// <summary>
        /// Startup config extension method.
        /// </summary>
        /// <param name="services">this/services. Must not be null.</param>
        /// <param name="config">The Configuration the Startup class was constructed with. Must not be null.</param>
        public static void AddJsonServerSettings(this IServiceCollection services, IConfiguration config)
        {
            services
                .AddOptions()
                .Configure<JsonServerSettings>(config.GetSection(JsonServerSettings.SettingsName));
        }
    }
}
