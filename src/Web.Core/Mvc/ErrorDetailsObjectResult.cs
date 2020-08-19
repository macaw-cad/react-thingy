using Microsoft.AspNetCore.Mvc;
using System;

namespace Web.Core.Mvc
{
    public class ErrorDetailsObjectResult<T> : ObjectResult where T : IErrorDetails
    {
        /// <summary>
        /// Creates a new <see cref="ErrorDetailsObjectResult"/> instance.
        /// </summary>
        /// <param name="problemDetails">Contains the errors to be returned to the client.</param>
        public ErrorDetailsObjectResult(ErrorProblemDetails<T> problemDetails) : base(problemDetails)
        {
            if (problemDetails is null)
            {
                throw new ArgumentNullException(nameof(problemDetails));
            }

            StatusCode = problemDetails.Status;
        }
    }
}
