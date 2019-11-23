using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Reflection;

namespace Web.Api.Core.Extensions
{
    public static class HealthCheckBuilderExtensions
    {
        public static IHealthChecksBuilder ApplicationInfoHealthCheck(this IHealthChecksBuilder builder, string name, IHostingEnvironment env)
        {
            if (builder == null)
            {
                throw new ArgumentNullException(nameof(builder));
            }

            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("Argument can not be null or empty string.", nameof(name));
            }

            if (env == null)
            {
                throw new ArgumentNullException(nameof(env));
            }

            var applicationVersion = "?.?.?.?";

            var applicationAssembly = Assembly.GetEntryAssembly();
            if (File.Exists(applicationAssembly.Location))
            {
                var assemblyFile = new FileInfo(applicationAssembly.Location);
                applicationVersion = FileVersionInfo.GetVersionInfo(assemblyFile.FullName).FileVersion;
            }

            builder.AddCheck($"{name}-{env.EnvironmentName}-v{applicationVersion}", () =>
            {
                return HealthCheckResult.Healthy();
            });

            return builder;
        }

        public static IHealthChecksBuilder AddSqlConnectionStringHealthCheck(this IHealthChecksBuilder builder, string name, IConfigurationSection connectionStringsSection)
        {
            return AddHealthChecksFromConfigSection(builder, name, connectionStringsSection, item => { builder.AddSqlServer(item.Value, "SELECT 1;", $"{name}-{item.Key}"); });
        }

        public static IHealthChecksBuilder AddUrisHealthCheck(this IHealthChecksBuilder builder, string name, IConfigurationSection healthCheckUrisSection)
        {
            return AddHealthChecksFromConfigSection(builder, name, healthCheckUrisSection, item => {

                builder.AddCheck($"{name}-{item.Key}", () =>
                {
                    var request = (HttpWebRequest)WebRequest.Create(item.Value);
                    request.Timeout = 3000;
                    request.AllowAutoRedirect = false; // find out if this site is up and don't follow a redirector
                    request.Method = "HEAD";

                    using (var response = (HttpWebResponse)request.GetResponse())
                    {
                        if (response.StatusCode == HttpStatusCode.OK)
                        {
                            return HealthCheckResult.Healthy();
                        }
                    }

                    return HealthCheckResult.Unhealthy();             
                });
            });
        }

        private static IHealthChecksBuilder AddHealthChecksFromConfigSection(this IHealthChecksBuilder builder, string name, IConfigurationSection section, Action<IConfigurationSection> operation)
        {
            if (builder == null)
            {
                throw new ArgumentNullException(nameof(builder));
            }

            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("Argument can not be null or empty string.", nameof(name));
            }

            if (section != null)
            {
                foreach (var item in section.GetChildren())
                {
                    operation.Invoke(item);
                }
            }

            return builder;
        }
    }
}
