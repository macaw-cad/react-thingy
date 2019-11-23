using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using NSwag.AspNetCore;

namespace Web.Api.Core.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection ConfigureApiVersioning(this IServiceCollection services)
        {
            if (services == null)
            {
                throw new ArgumentNullException(nameof(services));
            }

            //services.AddApiVersioning(o => {
            //    o.ReportApiVersions = true;
            //    o.AssumeDefaultVersionWhenUnspecified = true;
            //    o.DefaultApiVersion = new ApiVersion(1, 0);
            //});

            services.AddApiVersioning(
                options =>
                {
                    options.ReportApiVersions = true;
                });

            services.AddVersionedApiExplorer(
                options =>
                {
                    options.GroupNameFormat = "'v'VVV";
                    options.SubstituteApiVersionInUrl = true;
                });

            return services;
        }
        public static IServiceCollection ConfigureSwaggerDoc(this IServiceCollection services, string swaggerTitle, string swaggerDescription = null)
        {
            services.AddSwaggerDocument(settings =>
            {
                settings.PostProcess = document =>
                {
                    document.Info.Version = "v1";
                    document.Info.Title = swaggerTitle;
                    document.Info.Description = swaggerDescription;
                };
            });

            //services.AddSwaggerGen(
            //    options =>
            //    {
            //        var provider = services.BuildServiceProvider().GetRequiredService<IApiVersionDescriptionProvider>();
            //        foreach (var description in provider.ApiVersionDescriptions)
            //        {
            //            options.SwaggerDoc(description.GroupName, new Info
            //            {
            //                Title = swaggerTitle,
            //                Version = description.GroupName,
            //                Description = swaggerDescription
            //            });
            //        }
            //        options.ResolveConflictingActions(apiDescriptions => apiDescriptions.Last());
            //    });

            return services;
        }
    }
}
