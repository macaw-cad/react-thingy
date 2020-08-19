using Microsoft.AspNetCore.Builder;
using System;
using System.IO;
using System.Linq;
using System.Reflection;

namespace Web.Core.WebApi.DependencyInjection
{
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseSwaggerWithDocumentation(this IApplicationBuilder builder, Assembly[] documentationAssemblies)
        {
            EnsureXmlDocumentationFileNeededForSwaggerDocumention(documentationAssemblies);

            builder.UseOpenApi();
            builder.UseSwaggerUi3(settings =>
            {
                settings.DocExpansion = "list";
            });

            return builder;
        }

        private static void EnsureXmlDocumentationFileNeededForSwaggerDocumention(Assembly[] documentationAssemblies)
        {
            if (documentationAssemblies == null || !documentationAssemblies.Any())
            {
                throw new ArgumentNullException(nameof(documentationAssemblies), "parameter cannot be null or an empty array");
            }

            foreach(var assembly in documentationAssemblies)
            {
                var assemblyLocation = assembly.Location;

                var xmlDocumentationFile = $"{Path.GetDirectoryName(assemblyLocation)}\\{Path.GetFileNameWithoutExtension(assemblyLocation)}.xml";
                if (!File.Exists(xmlDocumentationFile))
                {
                    throw new FileNotFoundException("For documentation to be shown in the Swagger UI make sure that XML documentation is generated on building the project. On the properties of the project enable 'Output - XML documentation file'. Keep the default output path for the documentation.", xmlDocumentationFile);
                }
            }
        }
    }
}
