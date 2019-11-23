// See: https://dzone.com/articles/api-versioning-in-net-core

using Web.Api.Core.Helpers;

namespace Web.Api.Versioned.Controllers
{
    public class ConflictDetails : ErrorDetails
    {
        public string Name { get; set; }    // name of conflict
        public string Url { get; set; }     // url to conflict explanation
    }
}
