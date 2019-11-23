using static Web.Api.Core.Helpers.ProblemDetailsHelper;

namespace Web.Api.Core.Helpers
{
    public class ErrorDetailsException : ErrorDetails
    {
        public string Message { get; set; }
        public string StackTrace { get; set; }
        public string InnerExceptionMessage { get; set; }
    }
}
