using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Web.App.Hypernova;
// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Web.App
{
    public class StoryController : HypernovaController
    {
        public StoryController(ILogger<StoryController> logger, IHostingEnvironment env, IHttpClientFactory httpClientFactory, IOptions<HypernovaSettings> options)
            : base(logger, env, httpClientFactory, options)
        {
        }

        public async Task<IActionResult> ArtistStory(string artistId)
        {
            var artist = FindArtist(artistId);
            if (artist == null)
            {
                return NotFound();
            }

            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}";
            var hypernovaClient = new HypernovaClient(baseUrl, Logger, Env, HttpClientFactory, Options);
            var hypernovaFileCache = new HypernovaFileCache(Logger, Env, Options);
            var cacheItemName = $"ArtistStory_{artistId}.html";
            IHtmlContent hypernovaResult;
            ActionResult result = hypernovaFileCache.GetCachedActionResult(this, Settings.AmpPagesCacheName, cacheItemName);
            if (result == null)
            {
                hypernovaResult = hypernovaClient.React("pwa:HypernovaArtistStory", artist);

                result = hypernovaFileCache.StoreAndGetActionResult(this, Settings.AmpPagesCacheName, cacheItemName, hypernovaResult.ToString());
            }

            return result;
        }

        public async Task<IActionResult> ArtistStoryBookend(string artistId)
        {
            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}";
            var allArtistIds = GetAllArtistIds();
            allArtistIds.Remove(artistId);

            var components = new List<AmpStoryBookendComponent>();
            components.Add(new AmpStoryBookendComponent
            {
                type = "heading",
                text = new string[] { "Other artists" }
            });

            foreach (var id in allArtistIds)
            {
                var artist = FindArtist(id);
                var artistJson = JObject.Parse(artist);
                components.Add(new AmpStoryBookendComponent
                {
                    type = "landscape",
                    title = artistJson.Property("cover_artistname").Value.ToString(),
                    image = $"{baseUrl}/artists/{id}/cover.jpg",
                    url = $"{baseUrl}/Story/ArtistStory?artistId={id}"
                });
            }

            var curArtist = FindArtist(artistId);
            var curArtistJson = JObject.Parse(curArtist);
            var curArtistName = curArtistJson.Property("cover_artistname").Value.ToString();

            var ampStoryBookend = new AmpStoryBookend
            {
                bookendVersion = "v1.0",
                components = components.ToArray(),
                shareProviders = new object[]
                {
                    "email",
                    "whatsapp",
                    new AmpStoryBookendShareProvider
                    {
                        provider = "twitter",
                        text = $"The story of {curArtistName} - {baseUrl}/Story/ArtistStory?artistId={artistId}"
                    }
                }
            };
            return Json(ampStoryBookend);

        }

        private string FindArtist(string artistId) {
            var contentRoot = Env.ContentRootPath;
            var artistDataFile = Path.Combine(contentRoot, $@"ClientApp\public\artists\{artistId}\data.json");
            if (!System.IO.File.Exists(artistDataFile))
            {
                return null;
            }

            var jsonString = System.IO.File.ReadAllText(artistDataFile);
            var json = JObject.Parse(jsonString);
            json.Add(new JProperty("id", artistId));
            return json.ToString();
        }

        private async Task<string> FindArtistOverHttp(string artistId)
        {
            var httpClient = HttpClientFactory.CreateClient("artistStoryJson");
            httpClient.BaseAddress = new System.Uri($"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}");
            var jsonString = await httpClient.GetStringAsync($"/artists/{artistId}/data.json");
            var json = JObject.Parse(jsonString);
            json.Add(new JProperty("id", artistId));
            return json.ToString();
        }

        private List<string> GetAllArtistIds()
        {
            var artistIds = new List<string>();
            var contentRoot = Env.ContentRootPath;
            var artistRoot = Path.Combine(contentRoot, @"ClientApp\public\artists");
            var directories = Directory.GetDirectories(artistRoot);
            foreach (string dir in directories)
            {
                artistIds.Add(dir.Remove(0, artistRoot.Length + 1));
            }
            return artistIds;
        }
    }
}
