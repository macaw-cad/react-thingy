using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NSwag;
using System;
using Web.App.Api;
using Web.App.Hypernova;
using Web.App.HypernovaComponentServer;
using Web.App.JsonServer;

namespace Web.App
{
    public class Startup
    {
        private readonly ILogger _logger;

        public Startup(ILogger<Startup> logger, IConfiguration configuration)
        {
            _logger = logger;
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // The Kestrel configuration assumes that ASP.NET Core application runs behind a reverse proxy server (i.e. NGINX)
            // The reverse proxy forwards requests to the Kestrel web server.
            // Forwarded Headers: set environment variable ASPNETCORE_FORWARDEDHEADERS_ENABLED to true.
            // https://devblogs.microsoft.com/aspnet/forwarded-headers-middleware-updates-in-net-core-3-0-preview-6/
            // See also: https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-2.2
            if (string.Equals(Environment.GetEnvironmentVariable("ASPNETCORE_FORWARDEDHEADERS_ENABLED"), "true", StringComparison.OrdinalIgnoreCase))
            {
                services.Configure<ForwardedHeadersOptions>(options =>
                {
                    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                    // Only loopback proxies are allowed by default.
                    // Clear that restriction because forwarders are enabled by explicit configuration.
                    options.KnownNetworks.Clear();
                    options.KnownProxies.Clear();
                });
            }

            var mvc = services.AddMvc();

            mvc.SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            mvc.AddRazorPagesOptions(options =>
            {
                options.RootDirectory = "/Pages";
            });

            services.AddSingleton<ILoggerFactory, LoggerFactory>();
            services.AddSingleton(typeof(ILogger<>), typeof(Logger<>));

            services.AddTransient<Microsoft.AspNetCore.Http.IHttpContextAccessor, Microsoft.AspNetCore.Http.HttpContextAccessor>();

            // app specific
            services.AddHypernovaSettings(this.Configuration);
            services.AddHypernovaComponentServerSettings(this.Configuration);
            services.AddJsonServerSettings(this.Configuration);

            // When not in development, replace by a real distributed cache implementation
            services.AddDistributedMemoryCache();

            services.AddHttpClient();
            services.AddLogging();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddSwaggerDocument(settings =>
            {
                settings.PostProcess = document =>
                {
                    document.Info.Version = "v1";
                    document.Info.Title = "B4F API's";
                    document.Info.Description = "The B4F API's.<br/></br>For more information on the B4F API see <a target='_blank' href='https://github.com/macaw-interactive/react-thingy'>the documentation</a>.";
                };
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseForwardedHeaders();

            if (!env.IsDevelopment())
            {
                app.UseHsts();
            }

            app.UseExceptionHandler(errorApp =>
            {
                errorApp.Run(async context =>
                {
                    context.Response.StatusCode = 500;
                    context.Response.ContentType = "application/json";
                    var errorFeature = context.Features.Get<IExceptionHandlerFeature>();

                    if (errorFeature != null)
                    {
                        await context.Response.WriteAsync(JsonConvert.SerializeObject(new ApiErrorInternalServerError(errorFeature.Error.ToString())));
                    }
                });
            });

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.MapWhen(context => webPackDevServerMatcher(context), webpackDevServer =>
            {
                webpackDevServer.UseSpa(spa =>
                {
                    spa.UseProxyToSpaDevelopmentServer(baseUri: "http://localhost:3000");
                });
            });

            // Enable the Swagger UI middleware and the Swagger generator
            app.UseOpenApi();
            app.UseSwaggerUi3();

            app.UseMvc(mvcRoutes =>
            {
                mvcRoutes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");

                mvcRoutes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "SpaSsr", action = "Index" });
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    // Start the ClientPortal through the CreateReactApp server for speedy development
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                    // spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }

        // Captures the requests generated when using webpack dev server in the following ways:
        // via: https://localhost:5001/app/
        // via: https://localhost:5001/webpack-dev-server/app/
        // captures requests like these:
        // https://localhost:5001/webpack_dev_server.js
        // https://localhost:5001/__webpack_dev_server__/live.bundle.js
        // wss://localhost:5001/sockjs-node/978/qhjp11ck/websocket
        private bool webPackDevServerMatcher(Microsoft.AspNetCore.Http.HttpContext context)
        {
            string pathString = context.Request.Path.ToString();
            return pathString.Contains(context.Request.PathBase.Add("/webpack-dev-server")) ||
                context.Request.Path.StartsWithSegments("/__webpack_dev_server__") ||
                context.Request.Path.StartsWithSegments("/sockjs-node");
        }
    }
}
