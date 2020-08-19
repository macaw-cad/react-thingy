using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Text.Json.Serialization;

namespace Web.Core.Mvc
{
    public interface IErrorDetails
    {
    }

    public class ErrorProblemDetails<T> : ProblemDetails where T : IErrorDetails
    {
        public ErrorProblemDetails()
        {
            Title = "One or more exceptions occurred.";
            Status = StatusCodes.Status500InternalServerError;
        }

        public ErrorProblemDetails(T errorDetails) : this()
        {
            if (errorDetails is null)
            {
                throw new ArgumentNullException(nameof(errorDetails));
            }

            ErrorDetails = errorDetails;
        }

        [JsonPropertyName("errorDetails")]
        public T ErrorDetails { get; set; }
    }
}
