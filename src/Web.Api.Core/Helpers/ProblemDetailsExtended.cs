using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Core.Helpers
{
    public abstract class ProblemDetailsExtended : ProblemDetails
    {
        public string TraceIdentifier { get; set; }
    }

    public abstract class ProblemDetailsExtended<T> : ProblemDetailsExtended
    {
        public T ErrorDetails { get; set; }
    }
}
