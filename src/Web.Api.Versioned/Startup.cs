using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Web.Api.Core.Extensions;
using Web.Api.Core.Middleware;

namespace Web.Api.Versioned
{
    public class Startup
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly IHostingEnvironment _env;

        public Startup(ILogger<Startup> logger, IConfiguration configuration, IHostingEnvironment env)
        {
            _logger = logger;
            _configuration = configuration;
            _env = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.ConfigureApiVersioning();

            services.AddLogging();

            services.AddHealthChecks()
                .ApplicationInfoHealthCheck("api", _env)
                .AddSqlConnectionStringHealthCheck("connectionstrings", _configuration.GetSection("ConnectionStrings"))
                .AddUrisHealthCheck("healthCheckUris", _configuration.GetSection("HealthCheckUris"));

            services.ConfigureSwaggerDoc("Web.Api.Versioned Web API", "Healthchecks on:<ul><li><a href='/healthcheck'>/healthcheck</a></li><li><a href='/monitoring'>/monitoring</a></li></ul>");
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IApiVersionDescriptionProvider apiVersionDescriptionProvider)
        {
            app.UseMiddleware<ResponseTimeMiddleware>(); // must be the first in the pipeline
            app.UseMiddleware<ErrorHandlingMiddleware>();

            app.UseHealthCheckEndPoints();
            if (!env.IsProduction())
            {
                app.UseSwaggerWithOptionalApiVersioning(apiVersionDescriptionProvider);
            }

            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();

            // app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
