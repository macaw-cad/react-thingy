using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Swagger;
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
            var mvc = services.AddMvc();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Web.App B4F Api", Version = "v1" });
            });

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
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Web.App B4F Api V1");
                });
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

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
