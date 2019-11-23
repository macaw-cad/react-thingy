using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Core.Helpers
{
    public static class ProblemDetailsHelper
    {
        public static ProblemDetails CreateProblemDetails(int status, string detail, string traceIdentifier)
        {
            return CreateProblemDetails<ErrorDetails>(status, detail, traceIdentifier, null);
        }

        public static ProblemDetails CreateProblemDetails<T>(int status, string detail, string traceIdentifier, T errorDetails) where T : ErrorDetails
        {
            string title;
            string type;
            var typeFormat = "https://tools.ietf.org/html/rfc7231#section-{0}";

            switch (status)
            {
                case StatusCodes.Status400BadRequest:
                    title = "Bad Request";
                    type = string.Format(typeFormat, "6.5.1");
                    break;

                case StatusCodes.Status404NotFound:
                    title = "Not Found";
                    type = string.Format(typeFormat, "6.5.4");
                    break;

                case StatusCodes.Status409Conflict:
                    title = "Conflict";
                    type = string.Format(typeFormat, "6.5.8");
                    break;

                case StatusCodes.Status500InternalServerError:
                default:
                    title = "An unexpected error occurred!";
                    type = string.Format(typeFormat, "6.6.1");
                    break;
            }

            var problemDetails = new ProblemDetails
            {
                Type = type,
                Title = title,
                Status = status,
                Detail = detail,
                Instance = null,
            };

            problemDetails.Extensions.Add("traceId", traceIdentifier);
            if (errorDetails != null)
            {
                problemDetails.Extensions.Add("errorDetails", errorDetails);
            }

            return problemDetails;
        }
    }
}
