# Introduction

In this section we describe our vision on the development of Web API's.
We identify two type of Web API's:

- Back-end for front-end Web API's (B4F)
- Server-to-server Web API's (S2S)

## B4F Web API

Back-end to front-end Web API's are there to service the front-end application. There are part of the web app project (i.e. `Web.App)` and live in the folder `Api`.
The B4F API's have the following features:

- the API provides actions and returns data optimized for usage from front-end code
- the web app project can contain API's for multiple domains - everything needed from the front-end code
- the API is not versioned - the consuming code is part of the same project, or really close to the project containing the API
- the web app project uses NSwag to provide a Swagger UI to document the API and provide a "try" environment to execute the API calls
- based on the Swagger v2 (OpenAPI) specification TypeScript clients are generated to consume the Web API using typed information
- on the build server the TypeScript clients are regenerated on each build so changes in API's / types will directly break front-end code
- front-end optimized security over web service (Bearer tokens, etc)

## S2S Web API

- API's are organized per domain and each domain has it's own Visual Studio project (i.e. `Web.Api.NameOfDomain`)
- API's are versioned
- each domain API can be deployed separately

## Web.Api.Core helper project

The Web.Api.Core project is a helper project to ensure consistency and improve quality in the way we build B4F and S2S Web API's.
The core project provides functionality to:

- useful helper functions
- always produce a a general response-body for not happy-flow scenarios
- healthchecks and some useful helpers. It also adds Swagger, Swagger UI and Api-versioning to the web application


Due to the need to standarize an error response format for HTTP APIs, the Internet Engineering Task Force (IETF) published in March 2016 a document that defines a "problem details" as a way to carry machine-readable details of errors in a HTTP response to avoid the need to define new error response formats for HTTP APIs (Not reinvent the wheel).
Package installation
Install-Package ANWBReizen.WebApi.Core
Exception Handling
ANWBReizenControllerBase
The ANWBReizenControllerBase is a base class for ApiControllers to create a consisted response body for a badrequest (400) and a notfound (404) responses, for now. When using the overloads with a input argument. This argument is added to the "errors" object.
ErrorHandlingMiddleware
The ErrorHandlingMiddleware is a pipeline component to catch unhandled controller exceptions and create a consisted response body
Example problem details response body:
{
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
    "title": "Not Found",
    "status": 404,
    "detail": "The object couldn't be found.",
    "traceId": "0HLOR4KRAQMQH:00000003",
    "errors": [
        "Value: 2 not found"
    ]
}
Health checks
IHealthChecksBuilder extension methods
•	ApplicationInfoHealthCheck
o	Healthcheck to identify the running application with version and environment information, returns always Healthy.
•	AddSqlConnectionStringHealthCheck
o	Healthcheck to ping all connections that are configured in the specified section in the application configuration.
•	AddUrisHealthCheck
o	Healthcheck to ping all uris that are configured in the specified section in the application configuration.
Example appsettings.json:
{
  "ConnectionStrings": {
    "unhealthy-database": "my-connectionstring"
  },
  "HealthCheckUris": {
    "some-api": "https://some-api/healthcheck",
    "some-other-api": "https://some-other-api/healthcheck"
  }
}
IApplicationBuilder extension methods
•	UseHealthCheckEndPoints
o	add two healthcheck endpoints
	/healthcheck, only the summary of all healthchecks (Healty, Unhealthy).
	/monitoring, detailed information of all healthcheck (in json).
Swagger and Api-Versioning
IServiceCollection extension methods
•	AddApiVersioningAndSwaggerDoc
IApplicationBuilder extension methods
•	UseSwaggerWithApiVersioning
Helpers
•	ResponseTimeMiddleware
The ResponseTimeMiddleware is a pipeline component to measure the complete processing time in milliseconds of the a request and add it as a response header 'X-Response-Time-ms'.
In the sample below is a Startup.cs that demonstrates the use of all the pipeline components:
public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc()
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
            .AddJsonOptions(options =>
            {
                options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
            });

        var env = services.BuildServiceProvider().GetRequiredService<IHostingEnvironment>();
        services.AddHealthChecks()
            .ApplicationInfoHealthCheck("api", env)
            .AddSqlConnectionStringHealthCheck("connectionstrings", Configuration.GetSection("ConnectionStrings"))
            .AddUrisHealthCheck("healthCheckUris", Configuration.GetSection("HealthCheckUris"));

        services.AddApiVersioningAndSwaggerDoc("Test WebApi", "Healthchecks on:<ul><li><a href='/healthcheck'>/healthcheck</a></li><li><a href='/monitoring'>/monitoring</a></li></ul>");
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env, IApiVersionDescriptionProvider provider)
    {
        app.UseMiddleware<ResponseTimeMiddleware>(); // must be the first in the pipeline
        app.UseMiddleware<ErrorHandlingMiddleware>();
        app.UseHealthCheckEndPoints();

        if (!env.IsProduction())
        {
            app.UseSwaggerWithApiVersioning(provider);
        }

        app.UseHsts();
        app.UseHttpsRedirection();
        app.UseMvc();
    }
}
In the sample below is an api controller that demonstrates api-versioning and overloads:
[ApiVersion("1")]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class DemoController : ANWBReizenControllerBase
{
    [HttpGet("")]
    [HttpGet("{value}")]
    public async Task<IActionResult> Get(int value = 0)
    {
        switch (value)
        {
            case 1:
                return NotFound();
            case 2:
                return NotFound($"Value: {value} not found");
            case 3:
                throw new Exception($"A value {value} exception");
            case 4:
                return BadRequest();
            case 5:
                return BadRequest($"Value: {value} is bad");
        }

        await Task.Delay(1000);

        return Ok();
    }
}
References:
ASP.NET Core Middleware 
Health checks in ASP.NET Core 
Swagger 
ASP.NET API Versioning 
ProblemDetails Class 
Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content 

## Debugging Swagger configurations

When something is wrong with the Swagger configuration you will get a generic error like:

![Generic Swagger error](./Swagger&#32;UI&#32;error.png)

To get more detailed error information go to the url: `https://yourserver/swagger/v1/swagger.json`.
