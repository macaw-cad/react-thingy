using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Web.Core.Extensions;

namespace Web.Core.DependencyInjection
{
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseHealthCheckEndPoints(this IApplicationBuilder builder)
        {
            if (builder == null)
            {
                throw new ArgumentNullException(nameof(builder));
            }

            builder.UseHealthChecks("/hc");
            builder.UseHealthChecks("/mon", new HealthCheckOptions()
            {
                Predicate = _ => true, // don't filter on any checks
                ResponseWriter = (context, report) =>
                {
                    context.Response.ContentType = "application/json";

                    // create a report result where Status & Duration changed type to make it more readable
                    var options = new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                        IgnoreNullValues = false,
                        WriteIndented = true,
                    };
                    
                    var result = JsonSerializer.Serialize(new
                    {
                        Status = report.Status.ToString(),
                        TotalDuration = report.TotalDuration.ToString(),
                        Entries = report.Entries.Select(entry =>
                        {
                            var value = entry.Value;
                            return new
                            {
                                Key = entry.Key.ToJsonPropertyName(options).ToString(),
                                Value = new Dictionary<string, object>
                                {
                                    { "description", value.Description },
                                    { "status", value.Status.ToString() },
                                    { "duration", value.Duration.ToString() },
                                    { "data", value.Data },
                                    { "tags", value.Tags }
                                },
                            };
                        }).ToDictionary(p => p.Key, v => v.Value)
                    }
                    , options);

                    return context.Response.WriteAsync(result);
                }
            });

            return builder;
        }
    }
}
