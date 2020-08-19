using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Web.App.Api.Models;
using Web.Core.WebApi.Controllers;

namespace Web.App.Api
{
    [Route("api/starwars")]
    [ApiController]
    public class StarWarsController : ApiControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public StarWarsController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
        }

        [HttpGet("people")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(StarWarsPerson[]), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPeople(string query)
        {
            var filterPath = String.IsNullOrWhiteSpace(query) ? "" : $"?search={query}";

            var request = new HttpRequestMessage(HttpMethod.Get, $"http://swapi.dev/api/people{filterPath}");
            request.Headers.Add("ContentType", "application/json");

            var client = _httpClientFactory.CreateClient();

            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                using var responseStream = await response.Content.ReadAsStreamAsync();

                var starWarsPersons = await JsonSerializer.DeserializeAsync<IEnumerable<StarWarsPerson>>(responseStream);
                return Ok(starWarsPersons);
            }

            return Problem("Something went wrong getting Star Wars data");
        }
    }
}
