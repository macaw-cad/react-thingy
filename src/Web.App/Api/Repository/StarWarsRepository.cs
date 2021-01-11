using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Web.App.Api.Models;
using Web.App.Api.Services;

namespace Web.App.Api.Repository
{
    public interface IStarWarsRepository
    {
        /// <summary>
        /// Get Star Wars people by paging
        /// </summary>
        /// <param name="page"></param>
        /// <returns></returns>
        Task<IEnumerable<StarWarsPerson>> GetStarWarsPeopleAsync(int page);

        /// <summary>
        /// Get Star Wars Person by ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<StarWarsPerson> GetStarWarsPerson(int id);
    }

    public class StarWarsRepository : IStarWarsRepository
    {
        private const string HashKey = "StarWarsRepository";

        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ICachingService _cachingService;

        public StarWarsRepository(IHttpClientFactory httpClientFactory, ICachingService cachingService)
        {
            _httpClientFactory = httpClientFactory;
            _cachingService = cachingService;
        }

        public async Task<IEnumerable<StarWarsPerson>> GetStarWarsPeopleAsync(int page)
        {
            var cacheKey = $"{HashKey}-page-{page}";
            var requestMessage = new HttpRequestMessage
            {
                RequestUri = new Uri($"https://swapi.dev/api/people/?page={page}", UriKind.Absolute)
            };

            return await ExecuteCall(cacheKey, requestMessage, TransformPeopleToPersons);
        }

        public async Task<StarWarsPerson> GetStarWarsPerson(int id)
        {
            var cacheKey = $"{HashKey}-id-{id}";
            var requestMessage = new HttpRequestMessage
            {
                RequestUri = new Uri($"https://swapi.dev/api/people/{id}/", UriKind.Absolute)
            };

            return await ExecuteCall(cacheKey, requestMessage, TransformPeopleToPerson);
        }

        public async Task<T> ExecuteCall<T>(string cacheKey, HttpRequestMessage requestMessage,
            Func<string, T> transformFunc)
        {
            var cacheItem = _cachingService.GetCacheItem(cacheKey);

            if (cacheItem != null && !string.IsNullOrEmpty(cacheItem.Data))
            {
                requestMessage.Headers.TryAddWithoutValidation("If-None-Match", $"{cacheItem.Etag}");
            }

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            
            var response = await client.SendAsync(requestMessage);
            switch (response.StatusCode)
            {
                case HttpStatusCode.OK:
                    var content = await response.Content.ReadAsStringAsync();
                    var data = transformFunc(content);
            
                    _cachingService.SetCacheItem(cacheKey, response.Headers.ETag.Tag, JsonConvert.SerializeObject(data));
                    return data;
            
                case HttpStatusCode.NotModified:
                    return JsonConvert.DeserializeObject<T>(cacheItem.Data);
            
                default:
                    throw new InvalidOperationException();
            }
        }

        private static StarWarsPerson TransformPeopleToPerson(string content)
        {
            return JsonConvert.DeserializeObject<StarWarsPerson>(content);
        }

        private static IEnumerable<StarWarsPerson> TransformPeopleToPersons(string content)
        {
            return JsonConvert.DeserializeObject<StarWarsPersons>(content).Items;
        }
    }
}
