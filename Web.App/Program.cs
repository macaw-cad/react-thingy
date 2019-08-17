using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Web.App
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            // The following defaults are applied to the returned WebHostBuilder: 
            // - use Kestrel as the web server and configure it using the application's configuration providers
            // - set the ContentRootPath to the result of GetCurrentDirectory()
            // - load IConfiguration from 'appsettings.json' and 'appsettings.[EnvironmentName].json'
            // - load IConfiguration from User Secrets when EnvironmentName is 'Development' using the entry assembly
            // - load IConfiguration from environment variables
            // - configures the ILoggerFactory to log to the console and debug output
            // - enables IIS integration (how about Linux? - no IIS)
            // - enables the ability for frameworks to bind their options to their default configuration sections
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
