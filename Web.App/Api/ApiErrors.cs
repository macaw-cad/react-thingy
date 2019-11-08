using Newtonsoft.Json;
using System.Net;

namespace Web.App.Api
{
    /// <summary>
    /// Based on https://medium.com/@matteocontrini/consistent-error-responses-in-asp-net-core-web-apis-bb70b435d1f8
    /// </summary>
    public class ApiError
    {
        public int StatusCode { get; private set; }

        public string StatusDescription { get; private set; }

        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public string Message { get; private set; }

        public ApiError(int statusCode, string statusDescription)
        {
            this.StatusCode = statusCode;
            this.StatusDescription = statusDescription;
        }

        public ApiError(int statusCode, string statusDescription, string message)
            : this(statusCode, statusDescription)
        {
            this.Message = message;
        }
    }

    public class ApiErrorBadRequest : ApiError
    {
        public ApiErrorBadRequest()
            : base(404, HttpStatusCode.BadRequest.ToString())
        {
        }

        public ApiErrorBadRequest(string message)
            : base(404, HttpStatusCode.BadRequest.ToString(), message)
        {
        }
    }

    public class ApiErrorInternalServerError : ApiError
    {
        public ApiErrorInternalServerError()
            : base(500, HttpStatusCode.InternalServerError.ToString())
        {
        }

        public ApiErrorInternalServerError(string message)
            : base(500, HttpStatusCode.InternalServerError.ToString(), message)
        {
        }
    }
}
