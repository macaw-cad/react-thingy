﻿// See: https://dzone.com/articles/api-versioning-in-net-core
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Web.Api.Core.Controllers;
using Web.Api.Core.Helpers;

namespace Web.Api.Versioned.Controllers
{
    public enum ResponseTrigger
    {
        Ok = 0,
        BadRequest = 1,
        NotFound = 2,
        Conflict = 3,
        Exception = 4
    }

    public class GetBodyInput
    {
        public string Name { get; set; }
    }
    /// <summary>
    /// Example versioned api - version 1
    /// </summary>
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/versioned")]
    [ApiController]
    public class VersionedV1Controller : ApiControllerBase
    {
        /// <summary>
        /// Minimal sample implementation of version 1 of the versioned service.
        /// </summary>
        /// <remarks>
        /// Supported arguments: 0..4, 0 is default value and the Ok case, 1..4 give errors.
        /// 
        /// * Ok result - returns array of two strings
        /// * 1: 400 - BadRequest
        /// * 2: 404 - NotFound
        /// * 3: 409 - Conflict (with error details of type `ConflictDetails`)
        /// * 4: An uncatched exception resulting in 500 - InternalServerErrror
        /// </remarks>
        /// <param name="value">A value 0..4 for different error conditions.</param>
        /// <returns>An array with two sample strings.</returns>
        [HttpGet("{value}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProblemDetailsExtended), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetailsExtended), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetailsExtended<ConflictDetails>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(ProblemDetailsExtended<ErrorDetailsException>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<string[]>> Get(ResponseTrigger value = 0)
        {
            switch (value)
            {
                case ResponseTrigger.BadRequest:
                    return BadRequest();
                case ResponseTrigger.NotFound:
                    return NotFound($"Value: {value} not found");
                case ResponseTrigger.Conflict:
                    return Conflict<ConflictDetails>(new ConflictDetails { Name = "MyConflict", Url = "https://www.disney.com" });
                case ResponseTrigger.Exception:
                    throw new Exception($"A value {value} exception", new Exception("An inner exception"));
            }

            await Task.Delay(1000);

            return Ok(new string[] {
                "Value 1 from Versioned API version 1",
                "Value 2 from Versioned API version 1"
            });
        }

        /// <summary>
        /// ReturnBadRequest - should throw exception
        /// </summary>
        [HttpGet("ReturnBadRequest")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProblemDetailsExtended<ErrorDetailsException>), StatusCodes.Status500InternalServerError)]
        public ActionResult<string> ReturnBadRequest()
        {
            return BadRequest();
        }

        /// <summary>
        /// ReturnBadRequestWithString - should override ProblemDetails detail
        /// </summary>
        [HttpGet("ReturnBadRequestWithString")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProblemDetailsExtended), StatusCodes.Status500InternalServerError)]
        public ActionResult<string> ReturnBadRequestWithString()
        {
            return BadRequest("my BadRequest error");
        }

        /// <summary>
        /// WithBody - call with GET body. Note: on Swagger use POST.
        /// </summary>
        [HttpGet("WithBody")]
        [HttpPost("WithBody")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProblemDetailsExtended), StatusCodes.Status500InternalServerError)]
        public ActionResult<GetBodyInput> WithBody([FromBody]GetBodyInput input)
        {
            return Ok(input);
        }
    }
}