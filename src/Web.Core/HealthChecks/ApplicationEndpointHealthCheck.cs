using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Web.Core.HealthChecks
{
    public class ApplicationEndpointHealthCheck : IHealthCheck
    {
        private readonly Uri _requestUri;
        private readonly int _timeout;

        public ApplicationEndpointHealthCheck(Uri requestUri, int timeout = 3000)
        {
            _requestUri = requestUri ?? throw new ArgumentNullException(nameof(requestUri));
            _timeout = timeout;
        }

        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            var request = (HttpWebRequest)WebRequest.Create(_requestUri);
            request.Timeout = _timeout;
            request.AllowAutoRedirect = false; // find out if this site is up and don't follow a redirector
            request.Method = "HEAD";

            // any exception will also return a unhealthy result (with exception info)
            using (var response = (HttpWebResponse)request.GetResponse())
            {
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    return Task.FromResult(HealthCheckResult.Healthy("Application is up-and-running"));
                }
            }

            return Task.FromResult(HealthCheckResult.Unhealthy());
        }
    }
}
