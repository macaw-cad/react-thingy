using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Web.App.Api.Models;
using Web.Core.WebApi.Controllers;

namespace Web.App.Api
{
    [Route("api/serverroute")]
    public class ServerRouteController : ApiControllerBase
    {
        /// <summary>
        /// Get routing information based on the Uri.
        /// </summary>
        /// <remarks>
        /// Determine at server-side what routing should be executed at client-side.
        /// </remarks>
        /// <param name="route">The route path to resolve.</param>
        /// <returns>The server determined routing information of type <see cref="ServerRouteData"/>.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(ServerRouteData), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetServerRoute(string route)
        {
            if (string.IsNullOrWhiteSpace(route))
            {
                route = string.Empty;
            }

            return route.ToUpperInvariant() switch
            {
                "MULTIPLA" => Ok(new ServerRouteData
                {
                    Type = PageType.CarPage,
                    CarData = new Car
                    {
                        Make = "Fiat",
                        Year = 1998,
                        Speed = 170
                    }
                }),
                "FORD/FIESTA" => Ok(new ServerRouteData
                {
                    Type = PageType.CarPage,
                    CarData = new Car
                    {
                        Make = "Ford",
                        Year = 1976,
                        Speed = 190
                    }
                }),
                "BEAR" => Ok(new ServerRouteData
                {
                    Type = PageType.AnimalPage,
                    AnimalData = new Animal
                    {
                        Name = "Bear",
                        MaxAge = 30
                    }
                }),
                _ => NotFound(),
            };
        }
    }
}
