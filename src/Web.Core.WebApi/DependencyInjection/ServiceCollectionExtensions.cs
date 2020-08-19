using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.DependencyInjection;
using NSwag;
using NSwag.Generation.Processors.Security;
using System;
using System.Linq;
using System.Net;

namespace Web.Core.WebApi.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection ConfigureApiVersioning(this IServiceCollection services)
        {
            if (services == null)
            {
                throw new ArgumentNullException(nameof(services));
            }

            services.AddApiVersioning(options =>
            {
                options.ReportApiVersions = true;
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
            });

            services.AddVersionedApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'VVV";
                options.SubstituteApiVersionInUrl = true;
            });

            return services;
        }

        public static IServiceCollection ConfigureSwaggerDocWithoutVersioning(this IServiceCollection services, string swaggerTitle, string swaggerDescription = null)
        {
            if (services is null)
            {
                throw new ArgumentNullException(nameof(services));
            }

            services.AddOpenApiDocument(settings =>
            {
                settings.Title = swaggerTitle;
                settings.Description = swaggerDescription;

                // Add an authenticate button to Swagger for JWT tokens
                settings.OperationProcessors.Add(new OperationSecurityScopeProcessor("JWT token"));
                settings.AddSecurity("JWT token", Enumerable.Empty<string>(),
                    new OpenApiSecurityScheme()
                    {
                        Type = OpenApiSecuritySchemeType.ApiKey,
                        Name = nameof(Authorization),
                        In = OpenApiSecurityApiKeyLocation.Header,
                        Description = "Copy this into the value field: \nBearer {my long token}"
                    }
                );
            });

            return services;
        }

        public static IServiceCollection ConfigureSwaggerDocWithVersioning(this IServiceCollection services, string swaggerTitle, string swaggerDescription = null)
        {
            if (services is null)
            {
                throw new ArgumentNullException(nameof(services));
            }

            var provider = services.BuildServiceProvider().GetRequiredService<IApiVersionDescriptionProvider>();
            foreach (var description in provider.ApiVersionDescriptions)
            {
                services.AddOpenApiDocument(settings =>
                {
                    settings.Version = $"v{description.ApiVersion.MajorVersion}";
                    settings.Title = swaggerTitle;
                    settings.Description = description.IsDeprecated ? $@"{swaggerDescription}<h4 style=""color: #f93e3e;"">This API version has been deprecated</h4>" : swaggerDescription;
                    settings.DocumentName = description.GroupName;
                    settings.ApiGroupNames = new[] { settings.Version };

                    // Add an authenticate button to Swagger for JWT tokens
                    settings.OperationProcessors.Add(new OperationSecurityScopeProcessor("JWT token"));
                    settings.AddSecurity("JWT token", Enumerable.Empty<string>(),
                        new OpenApiSecurityScheme()
                        {
                            Type = OpenApiSecuritySchemeType.ApiKey,
                            Name = nameof(Authorization),
                            In = OpenApiSecurityApiKeyLocation.Header,
                            Description = "Copy this into the value field: \nBearer {my long token}"
                        }
                    );
                });
            }

            return services;
        }
    }
}
