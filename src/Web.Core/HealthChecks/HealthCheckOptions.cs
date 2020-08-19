using System.Collections.Generic;

namespace Web.Core.HealthChecks
{
    public class HealthCheckOptions
    {
        public const string HealthCheckSectionName = "HealthChecks";

        public IEnumerable<HealthCheckEndpointItem> ApplicationEndpoints { get; set; }

        public class HealthCheckEndpointItem
        {
            public string Name { get; set; }
            public string Url { get; set; }
            public int? Timeout { get; set; }
        }
    }
}
