using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Web.App.Api.Transformers;

namespace Web.App.Api
{
    [Route("api/starwars")]
    [ApiController]
    public class StarWarsController : ControllerBase
    {
        private readonly IHttpClientFactory httpClientFactory;

        public StarWarsController(IHttpClientFactory httpClientFactory)
        {
            this.httpClientFactory = httpClientFactory;
        }

        [Produces("application/json")]
        [HttpGet("people")]
        public async Task<IActionResult> GetPeople()
        {
            var client = httpClientFactory.CreateClient();

            var requestUri = new Uri("http://swapi.co/api/people");
            var response = await client.GetAsync(requestUri);

            var content = await response.Content.ReadAsStringAsync();

            var result = new StarWarsTransformer().TransformPeopleToPersons(content);

            return Ok(result);
        }
    }
}