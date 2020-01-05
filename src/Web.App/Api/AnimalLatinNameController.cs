using System.Net.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Web.App.Api.Models;

namespace Web.App.Api
{
    /// <summary>
    /// Web API to translate animal names to their Latin name.
    /// </summary>
    [Route("api/animallatinname")]
    [ApiController]
    public class AnimalLatinNameController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public AnimalLatinNameController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        /// <summary>
        /// Translate animal name to Latin.
        /// </summary>
        /// <param name="animalName">The English animal name.</param>
        /// <returns>The Latin translation object <see cref="AnimalLatinName"/>.</returns>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(typeof(AnimalLatinName), StatusCodes.Status200OK)]
        public ActionResult<AnimalLatinName> Get([FromQuery] string animalName)
        {
            if (animalName != null && animalName.ToUpperInvariant() == "BEAR")
            {
                return Ok(new AnimalLatinName { OriginalName = animalName, LatinName = "ursa" });
            }
            else
            {
                return Ok(new AnimalLatinName { OriginalName = animalName, LatinName = "unknown" });
            }
        }
    }
}