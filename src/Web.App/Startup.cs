using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Reflection;
using System.Text.Json;
using GraphQL.Server;
using Web.App.Api.Repository;
using Web.App.Api.Services;
using Web.App.GraphQL;
using Web.App.GraphQL.Queries;
using Web.App.GraphQL.Types;
using Web.App.Hypernova;
using Web.App.Middleware;
using Web.Core.DependencyInjection;
using Web.Core.HealthChecks;
using Web.Core.Infrastructure;
using Web.Core.Mvc;
using Web.Core.WebApi.DependencyInjection;
using Web.Core.WebApi.Middleware;

namespace Web.App
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Environment { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // The Kestrel configuration assumes that ASP.NET Core application runs behind a reverse proxy server (i.e. NGINX)
            // The reverse proxy forwards requests to the Kestrel web server.
            // Forwarded Headers: set environment variable ASPNETCORE_FORWARDEDHEADERS_ENABLED to true.
            // https://devblogs.microsoft.com/aspnet/forwarded-headers-middleware-updates-in-net-core-3-0-preview-6/
            // See also: https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-2.2
            if (Configuration.GetValue<bool>("ASPNETCORE_FORWARDEDHEADERS_ENABLED"))
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

            AddControllersWithViewsAndJsonSerializerOptions(services, Configuration);
            services.AddTransient<ProblemDetailsFactory, ErrorDetailsProblemDetailsFactory>(); // must be called after 'services.AddControllers();' as that is where the default factory is registered.            

            services.AddHttpContextAccessor();

            // app specific
            services.AddReverseProxySettings(Configuration);
            services.AddHypernovaSettings(Configuration);

            // When not in development, replace by a real distributed cache implementation
            services.AddDistributedMemoryCache();

            services.AddHttpClient();
            services.AddLogging();

            services.AddHealthChecks()
                .ApplicationInfoHealthCheck("Web.App")
                .AddApplicationEndpointsHealthCheck("ping", Configuration.GetSection(HealthCheckOptions.HealthCheckSectionName).Get<HealthCheckOptions>())
                ;

            services.ConfigureSwaggerDocWithoutVersioning("Web.App B4F Web API", "For more information on the B4F API see <a target='_blank' href='https://github.com/macaw-interactive/react-thingy'>the documentation</a>.<br/>Healthchecks on:<ul><li><a href='/hc'>Minimal (/hc)</a></li><li><a href='/mon'>Full (/mon)</a></li></ul>");

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            // Add GraphQL
            services.AddSingleton<StarWarsPersonSchema>();
            services.AddSingleton<PersonType>();
            services.AddSingleton<PersonQuery>();
            services.AddGraphQL(options =>
                {
                    options.EnableMetrics = true;
                })
                .AddErrorInfoProvider(opt => opt.ExposeExceptionStackTrace = true)
                .AddSystemTextJson();

            // Add Other
            services.AddSingleton<IStarWarsRepository, StarWarsRepository>();
            services.AddSingleton<ICachingService, CachingService>();
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app"></param>
        public void Configure(IApplicationBuilder app)
        {
            app.UseMiddleware<ErrorHandlingMiddleware>();
            app.UseMiddleware<ReverseProxyMiddleware>();

            app.UseHealthCheckEndPoints();

            if (!Environment.IsProduction())
            {
                app.UseSwaggerWithDocumentation(new[]
                {
                    Assembly.GetEntryAssembly(),
                });
            }

            if (Configuration.GetValue<bool>("ASPNETCORE_FORWARDEDHEADERS_ENABLED"))
            {
                app.UseForwardedHeaders();
            }

            // GraphQL
            app.UseGraphQL<StarWarsPersonSchema>();
            app.UseGraphQLPlayground();

            app.UseHsts();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.MapWhen(WebPackDevServerMatcher, webpackDevServer =>
            {
                webpackDevServer.UseSpa(spa =>
                {
                    spa.UseProxyToSpaDevelopmentServer(baseUri: SpaSsr.SpaServerBaseUrl);
                });
            });

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.AddPing();
                endpoints.MapFallbackToController("Index", "SpaSsr");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (Environment.IsDevelopment())
                {
                    // Start the ClientPortal through the CreateReactApp server for speedy development
                    spa.UseProxyToSpaDevelopmentServer(SpaSsr.SpaServerBaseUrl);
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
        private static bool WebPackDevServerMatcher(Microsoft.AspNetCore.Http.HttpContext context)
        {
            string pathString = context.Request.Path.ToString();
            return pathString.Contains(context.Request.PathBase.Add("/webpack-dev-server"), StringComparison.InvariantCulture) ||
                context.Request.Path.StartsWithSegments("/__webpack_dev_server__", StringComparison.InvariantCulture) ||
                context.Request.Path.StartsWithSegments("/sockjs-node", StringComparison.InvariantCulture);
        }

        private static void AddControllersWithViewsAndJsonSerializerOptions(IServiceCollection services, IConfiguration configuration)
        {
            if (services is null)
            {
                throw new ArgumentNullException(nameof(services));
            }

            if (configuration is null)
            {
                throw new ArgumentNullException(nameof(configuration));
            }

            var jsonSerializerOptions = CreateJsonSerializerOptions(configuration);

            // Add JsonSerializerOptions to the controllers and to the DI-container, otherwise the same settings won't available in (middleware) services
            services.AddTransient(_ => Options.Create(jsonSerializerOptions));
            services.AddControllersWithViews(mvcOptions => mvcOptions.RespectBrowserAcceptHeader = true)
                .AddJsonOptions(jsonOptions => CopySerializerOptions(jsonOptions, jsonSerializerOptions)
                );
        }

        private static JsonSerializerOptions CreateJsonSerializerOptions(IConfiguration configuration)
        {
            var jsonSerializerOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                IgnoreNullValues = true,
                WriteIndented = true,
                PropertyNameCaseInsensitive = true,
            };

            jsonSerializerOptions.Converters.Add(new ErrorProblemDetailsJsonConverterFactory());
            jsonSerializerOptions.Converters.Add(
                new ExceptionProblemDetailsJsonConverter(
                    configuration.GetSection(ExceptionProblemDetailsOptions.ExceptionProblemDetailsSectionName).Get<ExceptionProblemDetailsOptions>()
                ));

            return jsonSerializerOptions;
        }

        private static void CopySerializerOptions(JsonOptions jsonOptions, JsonSerializerOptions jsonSerializerOptions)
        {
            jsonOptions.JsonSerializerOptions.IgnoreNullValues = jsonSerializerOptions.IgnoreNullValues;
            jsonOptions.JsonSerializerOptions.WriteIndented = jsonSerializerOptions.WriteIndented;
            jsonOptions.JsonSerializerOptions.PropertyNameCaseInsensitive = jsonSerializerOptions.PropertyNameCaseInsensitive;
            foreach (var converter in jsonSerializerOptions.Converters)
            {
                jsonOptions.JsonSerializerOptions.Converters.Add(converter);
            }
        }
    }
}
