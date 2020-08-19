using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NSwag.Annotations;
using System;
using Web.Core.Infrastructure;
using Web.Core.Mvc;

namespace Web.Core.WebApi.Controllers
{
    public abstract class ApiControllerBase : ControllerBase
    {
        public new ErrorDetailsProblemDetailsFactory ProblemDetailsFactory => (ErrorDetailsProblemDetailsFactory)base.ProblemDetailsFactory;

        [OpenApiIgnore]
        [Obsolete("Intentionally hidden from base, in favour of BadRequest<T> with custom ErrorDetails.", true)]
        public new BadRequestResult BadRequest()
        {
            throw new NotSupportedException("Intentionally hidden from base, in favour of BadRequest<T> with custom ErrorDetails.");
        }

        [OpenApiIgnore]
        [Obsolete("Intentionally hidden from base, in favour of BadRequest<T> with custom ErrorDetails.", true)]
        public new BadRequestObjectResult BadRequest([ActionResultObjectValue] object error)
        {
            throw new NotSupportedException("Intentionally hidden from base, in favour of BadRequest<T> with custom ErrorDetails.");
        }

        [OpenApiIgnore]
        public BadRequestObjectResult BadRequest(string title, string detail = null)
        {
            return base.BadRequest(ProblemDetailsFactory.CreateProblemDetails(HttpContext, StatusCodes.Status400BadRequest, title, detail: detail));
        }

        [OpenApiIgnore]
        public override BadRequestObjectResult BadRequest([ActionResultObjectValue] ModelStateDictionary modelState)
        {
            return base.ValidationProblem(modelState) as BadRequestObjectResult;
        }

        [OpenApiIgnore]
        public BadRequestObjectResult BadRequest<T>([ActionResultObjectValue] T errorDetails) where T : IErrorDetails
        {
            return base.BadRequest(ProblemDetailsFactory.CreateErrorProblemDetails(HttpContext, errorDetails));
        }

        [OpenApiIgnore]
        public ErrorDetailsObjectResult<T> ErrorDetails<T>([ActionResultObjectValue] T errorDetails, int statusCode, string title = null, string details = null) where T : IErrorDetails
        {
            return new ErrorDetailsObjectResult<T>(ProblemDetailsFactory.CreateErrorProblemDetails(HttpContext, errorDetails, statusCode, title, details));
        }

        [OpenApiIgnore]
        [Obsolete("Intentionally hidden from base, in favour of NotFound<T> with custom ErrorDetails.", true)]
        public new NotFoundObjectResult NotFound([ActionResultObjectValue] object error)
        {
            throw new NotSupportedException("Intentionally hidden from base, in favour of NotFound<T> with custom ErrorDetails.");
        }

        [OpenApiIgnore]
        public NotFoundObjectResult NotFound<T>([ActionResultObjectValue] T errorDetails) where T : IErrorDetails
        {
            return base.NotFound(ProblemDetailsFactory.CreateErrorProblemDetails(HttpContext, errorDetails));
        }

        [OpenApiIgnore]
        [Obsolete("Intentionally hidden from base, in favour of Conflict<T> with custom ErrorDetails.", true)]
        public new ConflictObjectResult Conflict([ActionResultObjectValue] object error)
        {
            throw new NotSupportedException("Intentionally hidden from base, in favour of Conflict<T> with custom ErrorDetails.");
        }

        [OpenApiIgnore]
        public ConflictObjectResult Conflict<T>([ActionResultObjectValue] T errorDetails) where T : IErrorDetails
        {
            return base.Conflict(ProblemDetailsFactory.CreateErrorProblemDetails(HttpContext, errorDetails));
        }
    }
}
