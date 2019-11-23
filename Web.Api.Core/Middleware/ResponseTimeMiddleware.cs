using Microsoft.AspNetCore.Http;
using System.Diagnostics;
using System.Threading.Tasks;

namespace Web.Api.Core.Middleware
{
    public class ResponseTimeMiddleware
    {
        private const string RESPONSE_HEADER_RESPONSE_TIME = "X-Response-Time-ms";
        private readonly RequestDelegate next;

        public ResponseTimeMiddleware(RequestDelegate next)
        {
            this.next = next ?? throw new System.ArgumentNullException(nameof(next));
        }

        public async Task Invoke(HttpContext context)
        {
            if (context == null)
            {
                throw new System.ArgumentNullException(nameof(context));
            }

            var watch = new Stopwatch();
            watch.Start();

            context.Response.OnStarting(() =>
            {
                watch.Stop();
                context.Response.Headers[RESPONSE_HEADER_RESPONSE_TIME] = watch.ElapsedMilliseconds.ToString();

                return Task.CompletedTask;
            });

            await next(context);
        }
    }
}
