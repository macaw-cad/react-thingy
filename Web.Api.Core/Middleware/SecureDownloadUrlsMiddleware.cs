using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Web.Api.Core.Middleware
{
    public class SecureDownloadUrlsMiddleware
    {
        private readonly RequestDelegate next;

        public SecureDownloadUrlsMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context /* other dependencies */)
        {
            // get the token from query param
            var token = context.Request.Query["t"];
            // set the authorization header only if it is empty
            if (string.IsNullOrEmpty(context.Request.Headers["Authorization"]) &&
                !string.IsNullOrEmpty(token))
            {
                context.Request.Headers["Authorization"] = $"Bearer {token}";
            }
            await next(context);
        }
    }
}
