using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Web.App.Hypernova;

namespace Web.App
{
    public class StoryController : Controller
    {
        private readonly TimeSpan _cacheDuration = TimeSpan.FromDays(1.0);
        private readonly ILogger<StoryController> _logger;
        private readonly IHostingEnvironment _env;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IOptions<HypernovaSettings> _options;
        private readonly IDistributedCache _cache;
        private readonly HypernovaClient _hypernovaClient;
        private readonly HypernovaSettings _settings;
        private readonly string _contentRoot;


        public StoryController(ILogger<StoryController> logger, IHostingEnvironment env, IHttpClientFactory httpClientFactory, IOptions<HypernovaSettings> options, IDistributedCache cache)
        {
            _logger = logger;
            _env = env;
            _httpClientFactory = httpClientFactory;
            _options = options;
            _cache = cache;
            _settings = options.Value;
            _contentRoot = env.ContentRootPath;
        }

        public async Task<IActionResult> ArtistStory(string artistId)
        {
            var cacheItemName = $"ArtistStory_{artistId}.html";
            string appHtml = null;
           if (_settings.NoCaching == false)
            {
                appHtml = await _cache.GetStringAsync(cacheItemName);
            }

            if (appHtml == null)
            {
                var artistJson = FindArtist(artistId);
                if (artistJson == null)
                {
                    return NotFound();
                }

                var siteUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}";
                var hypernovaClient = new HypernovaClient(_logger, _env, _httpClientFactory, _options, siteUrl);

                var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}";
                artistJson.Add(new JProperty("baseUrl", baseUrl));

                var hypernovaResult = await hypernovaClient.React("pwa:HypernovaArtistStory", artistJson.ToString());
                appHtml = hypernovaResult.ToString();

                if (_settings.NoCaching == false)
                {
                    DateTime absoluteExpiration = DateTime.Now.Add(_cacheDuration);
                    await _cache.SetStringAsync(cacheItemName, appHtml, new DistributedCacheEntryOptions { AbsoluteExpiration = absoluteExpiration });
                }
            }

            var content = new ContentResult
            {
                Content = appHtml,
                ContentType = "text/html"
            };
            return content;
        }

        public ActionResult ArtistStoryBookend(string artistId)
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
                var artistJson = FindArtist(id);
                components.Add(new AmpStoryBookendComponent
                {
                    type = "landscape",
                    title = artistJson.Property("cover_artistname").Value.ToString(),
                    image = $"{baseUrl}/artists/{id}/cover.jpg",
                    url = $"{baseUrl}/Story/ArtistStory?artistId={id}"
                });
            }

            var curArtistJson = FindArtist(artistId);
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

        private JObject FindArtist(string artistId)
        {
            var artistDataFile = Path.Combine(_contentRoot, $@"ClientApp\public\artists\{artistId}\data.json");
            if (!System.IO.File.Exists(artistDataFile))
            {
                return null;
            }

            var jsonString = System.IO.File.ReadAllText(artistDataFile);
            var json = JObject.Parse(jsonString);
            json.Add(new JProperty("id", artistId));
            return json;
        }

        private List<string> GetAllArtistIds()
        {
            var artistIds = new List<string>();
            var artistRoot = Path.Combine(_contentRoot, @"ClientApp\public\artists");
            var directories = Directory.GetDirectories(artistRoot);
            foreach (string dir in directories)
            {
                artistIds.Add(dir.Remove(0, artistRoot.Length + 1));
            }
            return artistIds;
        }
    }
}
