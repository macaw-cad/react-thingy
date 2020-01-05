using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Newtonsoft.Json;
using System;
using System.Linq;
using NSwag.AspNetCore;
using System.Reflection;
using System.IO;

namespace Web.Api.Core.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseHealthCheckEndPoints(this IApplicationBuilder builder)
        {
            if (builder == null)
            {
                throw new ArgumentNullException(nameof(builder));
            }

            builder.UseHealthChecks("/healthcheck");
            builder.UseHealthChecks("/monitoring", new HealthCheckOptions()
            {
                Predicate = _ => true,
                ResponseWriter = async (c, r) =>
                {
                    c.Response.ContentType = "application/json";

                    var result = JsonConvert.SerializeObject(new
                    {
                        status = r.Status.ToString(),
                        totalDuration = r.TotalDuration.ToString(),
                        entries = r.Entries.Select(e => new { key = e.Key, value = e.Value.Status.ToString() })
                    });

                    await c.Response.WriteAsync(result);
                }
            });

            return builder;
        }

        public static IApplicationBuilder UseSwaggerWithOptionalApiVersioning(this IApplicationBuilder builder, IApiVersionDescriptionProvider provider = null)
        {
            EnsureXmlDocumentationFileNeededForSwaggerDocumention();
            
            builder.UseOpenApi();
            builder.UseSwaggerUi3(configuration =>
            {
                configuration.Path = "/swagger";
            });
            //builder.UseReDoc(configuration =>
            //{
            //    configuration.Path = "/redoc";
            //});

            return builder;
        }

        private static void EnsureXmlDocumentationFileNeededForSwaggerDocumention()
        {
            var applicationAssembly = Assembly.GetEntryAssembly();
            var assemblyDirectory = Path.GetDirectoryName(applicationAssembly.Location);
            var xmlDocumentationFile = Path.Combine(assemblyDirectory, Path.GetFileNameWithoutExtension(applicationAssembly.Location) + ".xml");
            if (!File.Exists(xmlDocumentationFile))
            {
                throw new Exception("For documentation to be shown in the Swagger UI make sure that XML documentation is generated on building the project. On the properties of the project enable 'Output - XML documentation file'. Keep the default output path for the documentation.");
            }
        }
    }
}
