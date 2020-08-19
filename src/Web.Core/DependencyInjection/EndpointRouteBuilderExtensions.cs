using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using System.Threading.Tasks;

namespace Web.Core.DependencyInjection
{
    public static class EndpointRouteBuilderExtensions
    {
        /// <summary>
        /// Lightweight endpoint to check if application is up-and-running.       
        /// </summary>
        /// <param name="endpoints"></param>
        /// <returns></returns>
        public static IEndpointConventionBuilder AddPing(this IEndpointRouteBuilder endpoints)
        {
            return endpoints.MapMethods("/ping", new[] { "HEAD" }, context =>
            {
                return Task.CompletedTask;
            });
        }
    }
}
