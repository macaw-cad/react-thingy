using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Hosting;
using System.Net;

namespace Web.App
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            // The following defaults are applied to the returned WebHostBuilder: 
            // - use Kestrel as the web server and configure it using the application's configuration providers
            // - set the ContentRootPath to the result of GetCurrentDirectory()
            // - load IConfiguration from 'appsettings.json' and 'appsettings.[EnvironmentName].json'
            // - load IConfiguration from User Secrets when EnvironmentName is 'Development' using the entry assembly
            // - load IConfiguration from environment variables
            // - configures the ILoggerFactory to log to the console and debug output
            // - enables IIS integration (how about Linux? - no IIS)
            // - enables the ability for frameworks to bind their options to their default configuration sections
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
#if false
                    webBuilder.UseKestrel(options =>
                    {
                        options.Listen(IPAddress.Loopback, 5000, listenOptions =>
                        {
                            listenOptions.Protocols = HttpProtocols.Http2;
                        });
                        options.Listen(IPAddress.Loopback, 5001, listenOptions =>
                        {
                            listenOptions.Protocols = HttpProtocols.Http2;
                            listenOptions.UseHttps();
                        });
                    });
#endif
                    webBuilder.UseStartup<Startup>();
                });
    }
}
