using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Web.Api.Versioned
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
#if false
                .UseKestrel(options =>
                {
                    options.Listen(IPAddress.Loopback, 5100, listenOptions =>
                    {
                        listenOptions.Protocols = HttpProtocols.Http2;
                    });
                    options.Listen(IPAddress.Loopback, 5101, listenOptions =>
                    {
                        listenOptions.Protocols = HttpProtocols.Http2;
                        listenOptions.UseHttps();
                    });
                }
                )
#endif
                .UseStartup<Startup>();
    }
}
