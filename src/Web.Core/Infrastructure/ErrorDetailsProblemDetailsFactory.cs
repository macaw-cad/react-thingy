using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using Web.Core.Mvc;

namespace Web.Core.Infrastructure
{
    public class ErrorDetailsProblemDetailsFactory : DefaultProblemDetailsFactory
    {
        public ErrorDetailsProblemDetailsFactory(IOptions<ApiBehaviorOptions> options) : base(options)
        {
        }

        public ErrorProblemDetails<T> CreateErrorProblemDetails<T>(
            HttpContext httpContext,
            T errorDetails,
            int? statusCode = null,
            string title = null,
            string type = null,
            string detail = null,
            string instance = null) where T : IErrorDetails
        {
            if (errorDetails == null)
            {
                throw new ArgumentNullException(nameof(errorDetails));
            }

            statusCode ??= StatusCodes.Status400BadRequest;

            var problemDetails = new ErrorProblemDetails<T>(errorDetails)
            {
                Status = statusCode,
                Title = title,
                Type = type,
                Detail = detail,
                Instance = instance,
            };

            if (title != null)
            {
                // For validation problem details, don't overwrite the default title with null.
                problemDetails.Title = title;
            }

            ApplyProblemDetailsDefaults(httpContext, problemDetails, statusCode.Value);

            return problemDetails;
        }

        public ExceptionProblemDetails CreateExceptionProblemDetails(
            HttpContext httpContext,
            Exception exception,
            int? statusCode = null,
            string title = null,
            string type = null,
            string detail = null,
            string instance = null)
        {
            if (exception == null)
            {
                throw new ArgumentNullException(nameof(exception));
            }

            statusCode ??= StatusCodes.Status500InternalServerError;

            var problemDetails = new ExceptionProblemDetails(exception)
            {
                Status = statusCode,
                Title = title,
                Type = type,
                Detail = detail,
                Instance = instance,
            };

            if (title != null)
            {
                // For validation problem details, don't overwrite the default title with null.
                problemDetails.Title = title;
            }

            ApplyProblemDetailsDefaults(httpContext, problemDetails, statusCode.Value);

            return problemDetails;
        }
    }
}
