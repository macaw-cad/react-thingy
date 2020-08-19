using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace Web.Core.HealthChecks
{
    public class ApplicationInfoHealthCheck : IHealthCheck
    {
        private readonly IHostEnvironment _environment;

        public ApplicationInfoHealthCheck(IHostEnvironment environment)
        {
            _environment = environment ?? throw new ArgumentNullException(nameof(environment));
        }

        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            var data = new Dictionary<string, object>
            {
                { "environment", _environment.EnvironmentName },
            };

            var applicationAssembly = Assembly.GetEntryAssembly();
            if (File.Exists(applicationAssembly.Location))
            {
                var assemblyFile = new FileInfo(applicationAssembly.Location);

                data.Add("version", FileVersionInfo.GetVersionInfo(assemblyFile.FullName).FileVersion);
                data.Add("name", assemblyFile.Name);
            }

            return Task.FromResult(
                HealthCheckResult.Healthy("Application self-check and should always returns healthy", data)
            );
        }
    }
}
