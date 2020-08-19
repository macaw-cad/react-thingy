using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using Web.Core.HealthChecks;

namespace Web.Core.DependencyInjection
{
    public static class HealthCheckBuilderExtensions
    {
        public static IHealthChecksBuilder ApplicationInfoHealthCheck(this IHealthChecksBuilder builder, string name, IEnumerable<string> tags = null)
        {
            if (builder is null)
            {
                throw new ArgumentNullException(nameof(builder));
            }

            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("Argument can not be null or empty string.", nameof(name));
            }

            builder.AddCheck<ApplicationInfoHealthCheck>(name, tags: tags);

            return builder;
        }

        public static IHealthChecksBuilder AddApplicationEndpointsHealthCheck(this IHealthChecksBuilder builder, string name, HealthCheckOptions options)
        {
            if (builder is null)
            {
                throw new ArgumentNullException(nameof(builder));
            }

            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("Argument can not be null or empty string.", nameof(name));
            }

            if (options != null)
            {
                foreach(var item in options.ApplicationEndpoints)
                {
                    if (String.IsNullOrWhiteSpace(item.Name))
                    {
                        throw new ArgumentException("HealthCheck:Endpoints Name can not be null or empty string.", nameof(item.Name));
                    }

                    if (!Uri.TryCreate(item.Url, UriKind.Absolute, out var requestUri))
                    {
                        throw new ArgumentException("HealthCheck:Endpoints Url must be a valid uri.", nameof(item.Url));
                    }

                    var check = item.Timeout.HasValue
                        ? new ApplicationEndpointHealthCheck(requestUri, item.Timeout.Value)
                        : new ApplicationEndpointHealthCheck(requestUri);

                    builder.AddCheck($"{name}-{item.Name}", check);
                }
            }

            return builder;
        }
    }
}
