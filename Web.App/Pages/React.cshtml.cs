using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Web.App.Hypernova;

namespace Web.App.Pages
{
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public class ReactModel : PageModel
    {
        public readonly HypernovaClient hypernovaClient;
        public ReactModel(
            Microsoft.AspNetCore.Http.IHttpContextAccessor httpContextAccessor,
            Microsoft.Extensions.Logging.ILogger<ReactModel> logger,
            Microsoft.AspNetCore.Hosting.IHostingEnvironment env,
            System.Net.Http.IHttpClientFactory httpClientFactory,
            Microsoft.Extensions.Options.IOptions<Web.App.Hypernova.HypernovaSettings> options
        )
        { 
            BaseUrl = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}";
            hypernovaClient = new Web.App.Hypernova.HypernovaClient(logger, env, httpClientFactory, options);
        }

        public string BaseUrl { get; set; }
        public string Text { get; set; }

        public void OnGet()
        {
            Text = "Hello world";
        }
    }
}
