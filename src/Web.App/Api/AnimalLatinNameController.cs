using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Web.App.Api.Models;
using Web.Core.WebApi.Controllers;

namespace Web.App.Api
{
    /// <summary>
    /// Web API to translate animal names to their Latin name.
    /// </summary>
    [Route("api/animallatinname")]
    [ApiController]
    public class AnimalLatinNameController : ApiControllerBase
    {
        /// <summary>
        /// Translate animal name to Latin.
        /// </summary>
        /// <param name="animalName">The English animal name.</param>
        /// <returns>The Latin translation object <see cref="AnimalLatinName"/>.</returns>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(typeof(AnimalLatinName), StatusCodes.Status200OK)]
        public IActionResult Get(string animalName)
        {
            if (string.IsNullOrWhiteSpace(animalName))
            {
                animalName = String.Empty;
            }

            return (animalName.ToUpperInvariant()) switch
            {
                "BEAR" => Ok(new AnimalLatinName { OriginalName = animalName, LatinName = "ursa" }),
                _ => Ok(new AnimalLatinName { OriginalName = animalName, LatinName = "unknown" }),
            };
        }
    }
}
