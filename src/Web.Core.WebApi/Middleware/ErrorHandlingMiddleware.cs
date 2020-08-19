using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Text.Json;
using System.Threading.Tasks;
using Web.Core.Infrastructure;

namespace Web.Core.WebApi.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILoggerFactory _loggerFactory;
        private readonly ErrorDetailsProblemDetailsFactory _problemDetailsFactory;

        public ErrorHandlingMiddleware(RequestDelegate next, ILoggerFactory loggerFactory, ProblemDetailsFactory problemDetailsFactory)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _loggerFactory = loggerFactory ?? throw new ArgumentNullException(nameof(loggerFactory));            
            _problemDetailsFactory = (ErrorDetailsProblemDetailsFactory)problemDetailsFactory ?? throw new ArgumentNullException(nameof(problemDetailsFactory));
        }

        public async Task Invoke(HttpContext context, IOptions<JsonSerializerOptions> options)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                // try to get controller name to create logger
                if (!context.Request.RouteValues.TryGetValue("controller", out var categoryName))
                {
                    categoryName = nameof(ErrorHandlingMiddleware);
                }

                _loggerFactory.CreateLogger(categoryName.ToString()).LogError(ex, "An unexpected error occurred!");

                if (context.Request.Headers["Accept"].ToString().Contains("application/json", StringComparison.OrdinalIgnoreCase))
                {
                    await HandleExceptionAsync(context, ex, options.Value);
                }
                else
                {
                    // When not a JSON request then rethrow original exception so it can be handled by next middleware in the pipeline
                    throw;
                }
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception, JsonSerializerOptions options)
        {
            var problemDetails = _problemDetailsFactory.CreateExceptionProblemDetails(context, exception);
            var result = JsonSerializer.Serialize(problemDetails, options);

            context.Response.ContentType = "application/problem+json";

            if (problemDetails.Status.HasValue)
            {
                context.Response.StatusCode = problemDetails.Status.Value;
            }

            return context.Response.WriteAsync(result);
        }
    }
}
