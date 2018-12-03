using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Web.App.Hypernova;

namespace Web.App
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var mvc = services.AddMvc();
            mvc.SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            mvc.AddRazorPagesOptions(options => {
                options.RootDirectory = "/Pages";
            });

            services.AddSingleton<ILoggerFactory, LoggerFactory>();
            services.AddSingleton(typeof(ILogger<>), typeof(Logger<>));

            services.AddTransient<Microsoft.AspNetCore.Http.IHttpContextAccessor, Microsoft.AspNetCore.Http.HttpContextAccessor>();
            //           services.AddTransient<Microsoft.AspNetCore.Hosting.IHostingEnvironment, Microsoft.AspNetCore.Hosting.HostingEnvironment>();
            //            services.AddTransient<System.Net.Http.IHttpClientFactory, System.Net.Http.HttpClientFactory>();
            //            services.AddTransient<Microsoft.Extensions.Options.IOptions<Web.App.Hypernova.HypernovaSettings> options

            //            services.Configure<HypernovaSettings>(options => Configuration.GetSection("Hypernova").Bind(options));

            // app specific
            services.AddHypernovaSettings(this.Configuration);

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
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

        //    app.UseWhen(
        //        context => context.Request.Path.StartsWithSegments(new PathString("/foo")), //SSR aan
        //a => a.Use(async (context, next) =>
        //{
        //    Console.WriteLine("B (before)");
        //    await next();
        //    Console.WriteLine("B (after)");
        //}));

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
    }
}
