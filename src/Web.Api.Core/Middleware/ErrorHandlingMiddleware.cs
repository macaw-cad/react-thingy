using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using Web.Api.Core.Helpers;

namespace Web.Api.Core.Middleware
{

    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            this.next = next ?? throw new ArgumentNullException(nameof(next));
        }

        public async Task Invoke(HttpContext context, ILogger<ErrorHandlingMiddleware> logger)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            if (logger == null)
            {
                throw new ArgumentNullException(nameof(logger));
            }

            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An unexpected error occurred!");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var problemDetails = ProblemDetailsHelper.CreateProblemDetails<ErrorDetailsException>(StatusCodes.Status500InternalServerError, null, context.TraceIdentifier, new ErrorDetailsException
            {
                Message = exception.Message,
                StackTrace = exception.StackTrace,
                InnerExceptionMessage = exception.InnerException != null? exception.InnerException.ToString() : null
            });

            var result = JsonConvert.SerializeObject(problemDetails);

            context.Response.ContentType = "application/problem+json";
            context.Response.StatusCode = (int)problemDetails.Status;

            return context.Response.WriteAsync(result);
        }
    }
}
