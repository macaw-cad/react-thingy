# React Thingy 

Welcome to **React Thingy**. a sample project where we combined learnings and best practices of
previous React projects we executed at Macaw Interactive, a Dutch Digital Agency. 

# The technology stack

At Macaw Interactive we made choices with respect to the front-end development technology stack that we use, and the way we build web applications. Our primary front-end technology stack consists of:

- ReactJS (using Redux where applicable)
- TypeScript
- Server-side rendering for SEO

For more information on the Macaw Interactive thoughts on technology complemented with an assessment result see the [Macaw Interactive front-end Technology Radar](https://github.com/macaw-interactive/radar).

# Why we named it React Thingy?

We don't call it a
boilerplate, a starter kit or something like that - it is the current state of best practices that
we might use for our next project (we are actually doing that right now). But for other projects
we are going to start in the future we will look at our insight in front-end development at that moment.
Things in front-end land are changing so fast! We don't want to invest in standardizing code for
all our projects because that will result in dragging a large code base into a project, where that
code must be maintained and becomes legacy the moment it is pulled in. That is why we don't give it
a hefty name, but just call it a **Thingy**.

## Features of React Thingy

The provided .NET Core 2.2 Web.App solution is a complete configured front-end development solution
containing sample code to show how it works. The solution is based on a
default .NET Core web site project (Web.App) with React as provided by the Visual Studio .NET Core
starter, but we changed the setup and configuration to extend it and to enable TypeScript for font-end
development.

The project combines the following technologies:

- A .NET Core 2.2 web application rendering a Single Page Application (SPA), Razor Pages and AMP pages
- The frontend project is bootstrapped with Create React App 3 (CRA3)
- All frontend code is written in TypeScript and checked with TSLint
- Hypernova based server-side rendering for single components, the complete SPA or AMP pages
- Server-side rendered SPA can be async, so components in the SPA can make async calls to retrieve data 
  or have promises to be resolved before rendering
- JSon Server based mock api
- Storybook to manage the design system

And the solution provides the configuration and scripts to package all this goodness into a Linux Docker 
image that can be used as unit of deployment.

## How to use this code base?

If you think this Thingy is useful then clone it and make it your own. Throw away the stuff you
don't use, modify the code you use. All the code is here - no dependencies on custom created nuget
or npm packages that makes it more difficult to change the stuff. If you find issues or have 
improvement then please give us a pull request.

## Get the solution working on your local box

Before tayloring the solution it is best to get the solution up and running on your local developer machine.
To do this you need to execute the following steps:

- Install the npm packages in the folders `Web.App/ClientApp` and `Web.App/HypernovaComponentServer` by executing the command `npm install` in these folders.
- in the folder `Web.App/ClientApp` execute the following commands:
  - `npm start` to transpile and start the front-end code on port 3000, runs in watch mode so restarts on code changes
  - `npm run start:server-bundle` to transpile the server-bundle.js, runs in watch mode so restarts on code changes
  - `npm run start:hypernovacomponentserver` to start the Hypernova based component server on port 8080
  - `npm run start:jsonserver` to start the mock server
  - `npm run start:storybook` to start Storybook for out of context component development
- Open the `Web.App.sln` solution in Visual Studio
- Right-click on the Web.App project, and select `properties`. Configure the properties on the `Debug` tab to reflect the values below, and start the debugger:

![Debug configuration](./README.artifacts/Web.App_debug_configuration.png)

## Hotel

An easier way to start one or more of the above npm scripts is through a tool called [Hotel](https://github.com/typicode/hotel). In the folder `Web.App/ClientApp` execute the script `starthotel.bat` to start the tool. This scripts configures Hotel and opens a web browser on `http://localhost:2000` where you can start/stop any of the above mentioned npm scripts:

![Hotel](./README.artifacts/Hotel.png)

- Flip the switch to start/stop the npm script
- Click on the bar outside the title to see output of the script
- Click on the title in the bar to open the web browser on the specific script
  
## Configure the solution

To tailor the solution for your project there are two configuration files:

- ```envSolution.bat``` for configuring the name of your solution through the setting ```SOLUTIONNAME```.
- ```env.<USERNAME>.bat``` for user specific settings related to deployment of the Docker container. This file contains the following settings:
  - ```CONTAINERREGISTRY_URL``` - the URL of the container registry, for Azure in the format of ```<registryname>.azurecr.io```
  - ```CONTAINERREGISTRY_USERNAME``` - username for this registry
  - ```CONTAINERREGISTRY_PASSWORD``` - password for this registry

Note that all ```env.*.bat``` files are excluded from source control.

## Working with the code

To edit the .NET Core application web open the solution ```Web.App.sln```. When the project ```Web.App``` is started (development mode) it expects a SPA application running on http://localhost:3000.

Open the project at the root folder in Visual Studio Code, so NOT at the ```Web.App\ClientApp``` folder - otherwise the configured debugging settings will not work.

The folder ```Web.App\ClientApp``` contains a ```package.json``` file containing scripts
for developing and building the application. See [README development](./documentation/development.md) for more information on how to do development with the solution.

### Enforce HTTPS in ASP.NET Core

As described in the article [Enforce HTTPS in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/security/enforcing-ssl) we need to enforce HTTPS for both the web applications and the web api's. When we use HTTPS we can also enable [HTTP/2](https://www.upwork.com/hiring/development/the-http2-protocol-its-pros-cons-and-how-to-start-using-it/) which provides many advantages over HTTP like multiplexing and binary data transfer.

Some key points:
- app.UseHsts() should only be used on web sites, not on web api's
- :

### Generating SSL certificate for development
If you're getting SSL certificate issues in your browser, you might need to generate a self-signed certificate. Do that using ```dotnet dev-certs https --trust``` in the ```\Web.app``` folder. Read more about it [here](https://www.hanselman.com/blog/DevelopingLocallyWithASPNETCoreUnderHTTPSSSLAndSelfSignedCerts.aspx).

## Global configuration in .editorconfig

As described in the Microsoft article [Create portable, custom editor settings with EditorConfig](https://docs.microsoft.com/en-us/visualstudio/ide/create-portable-custom-editor-options?view=vs-2019) the file `.editorconfig` can be used to manage global settings for the whole solution. We placed the global `.editorconfig` file next to the `Web.App.sln` file to it is applied to all projects.

One of the useages of the `.errorconfig` file is to suppress warnings from the FXCop Analyzers as installed in the solution to improve code qualities.

One of the given warnings is **CA2007: Do not directly await a Task** which is not applicable in .NET Core. We can suppress this error by adding the following lines to the `.editorconfig` file:

```
[*.cs]
dotnet_diagnostic.CA2007.severity = none
```

## NSwag and Web API documentation

NOTA BENE: For documentation to be shown in the Swagger UI make sure that XML documentation is generated on building the project. On the properties of the project enable **Output - XML documentation file**. Keep the default output path for the documentation.

Documentation is available in two formats:

- Swagger - at url `/swagger` - has a great "Try it out" option
- ReDoc - at url `/redoc` - more modern layout

The documentation is taken from the XML documentation above the C# API methods and from special attributes about the return values and error values. Although the documentation for C# is in XML format and supports formatting tags like `<list>...</list>`, these formatting tags are not used in the OpenAPI specification. For formatting only [CommonMark Markdown syntax](https://spec.commonmark.org/0.27/) is supported as described in the [OpenAPI Specification](https://swagger.io/specification/).

An example of a Web API method with documentation and return value/error value attributes:

```c#
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
public async Task<ActionResult<string[]>> Get(int value = 0)
{
    :
}
```

Microsoft introduced a special return type for errors for Web API methods in ASP.NET Core 2.1: [ProblemDetails](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc.problemdetails). We adopted this approach, and extended the ProblemDetails type with one mandatory, and one optional field:

```c#
public abstract class ProblemDetailsExtended : ProblemDetails
```
{
    public string TraceIdentifier { get; set; }
}

public abstract class ProblemDetailsExtended<T> : ProblemDetailsExtended
{
    public T ErrorDetails { get; set; }
}
```

The `TraceIdentifier` will always be set based on `HttpContext.TraceIdentifier`. ErrorDetails can be additionally specifiedby using the generic type `ProblemDetailsExtended<T>` as shown is the example Web API method above.

All Web API controllers must inherit from `ApiControllerBase` which contains special versions of functions like `BadRequest`, `NotFound` etc which will produce error return values of type `ProblemDetailsExtended` or `ProblemDetailsExtended <>T>`.

## NSwag and client generation







## Starting the Visual Studio solution

When working in Visual Studio you want to be able to start the solution for debugging. The solution consists of two front-end projects:

- `Web.App`
- `Web.Api.Versioned`

To start both projects when hitting the `Start button`, right-click on the solution `Web.App` and select `Set Startup Projects...`:

![Multiple startup projects](Multiple-startup-projects-VisualStudio.png)

The Visual Studio bar now shows `<Multiple Startup Projects>`. The `Start` link now stats both projects.

![Multiple startup projects selected](Multiple-startup-projects-selected-VisualStudio.png)



## Deploying the solution

The ```Web.App``` is deployed in a Docker container that can be run locally or deployed to a hosting platform like Azure.
See [documentation on using Docker](./documentation/Docker.md) for more information on the available scripts to build and deploy the Docker image.

## Working examples

The code provides some examples that can be found at the folowing URL's when the application is running:

- ```http://localhost:3000``` - the SPA built by CRA3, running only client-side
- ```https://localhost:5001``` - the SPA running from the DotNet Core application

All parts of the sample application can be reached through the web UI.

Note that the AMP stories page does not work when running under http://localhost:3000 because AMP pages need to be rendered server-side.

## Hosting the application

The complete application will be hosted in one or more Docker containers so we have a unit of deployment to go through dev, test, acceptation and production.

The application currently consists of the following parts:

- Web.App - The ASP.NET Core based web application running on Kestrel
- HypernovaComponentServer - The NodeJS + Hypernova based component server for server-side React rendering
- JsonServer - A NodeJS based mock server for serving mock data

In front of the web application NGINX is used as a reverse proxy. NGINX handles caching and forwards requests to the Kestrel web server. 

When working with a reverse proxy server in front of the ASP.NET Core web application we need to use forwarding headers as described in [Configure ASP.NET Core to work with proxy servers and load balancers](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/proxy-load-balancer?view=aspnetcore-2.2).


## Code quality

An import things in developing an application is code quality. To check the C# code for security, performance, and design issues, among others we use [Microsoft.CodeAnalysis.FxCopAnalyzers](https://www.nuget.org/packages/Microsoft.CodeAnalysis.FxCopAnalyzers). It is referenced as a NuGet package instead of as a VSIX extension on Visual Studio so everyone uses the same chercks and the checks can be executed on the build server as well.


## API error handling
For error handling in the Web API calls we adopted the approach layed-out in [Consistent error responses in ASP.NET Core Web APIs](https://medium.com/@matteocontrini/consistent-error-responses-in-asp-net-core-web-apis-bb70b435d1f8). An ApiErrors class contains the methods for consistent error results.

In `startup.cs` we also added middleware using `app.UseExceptionHandler()` to handle uncatched errors in the pipeline. This prevents us from wrapping the implementation of API methods into try-catch blocks.


## TODO

See the [TODO](./TODO.md) file for things still to be implemented in Web.App.

## Setting up an Azure DevOps project for build and deploy

Open the [Azure Portal](https://portal.azure.com) and search for **DevOps Projects**. This is one of the coolest features of the Azure Portal that enables you to set up a completely configured Azure DevOps project including Ci/CD configuration.

1. Select the **New** button
2. Select the .NET project (Next)
   ![.NET Project](README.artifacts/1&#32;-&#32;New&#32;DevOps&#32;-&#32;DotNet.png)
3. Select ASP.NET Core (Next)
   ![ASP.NET Core](README.artifacts/2&#32;-&#32;New&#32;DevOps&#32;ASPNET&#32;Core.png)
4. Select Web App for Containers (Next)
   ![Web App for Containers](README.artifacts/3&#32;-&#32;New&#32;DevOps&#32;Web&#32;App&#32;for&#32;Containers.png)
5. Final configuration
   ![Final DevOps configuration](README.artifacts/4&#32;-&#32;New&#32;DevOps&#32;Configuration.png)
   Note that we use as resource group **linuxresourcesX** and as container registry name **svdoeverX**. We want to use an existing resource group (linuxresources) and an existing container registry (svdoeverX), but the Azure DevOps project creation tool does not support reuse of existing elements. We correct this when we modifying the created build and release pipelines for out project.

The DevOps project generator start working until the deployment is complete.

![](README.artifacts/5&#32;-&#32;New&#32;DevOps&#32;deployment&#32;complete.png)

This results in a DevOps project configuration with a code repository, a build pipeline and a release pipeline that starts building an releasing right away.

![CI/CD pipeline](README.artifacts/6&#32;-&#32;New&#32;DevOps&#32;azure&#32;resources&#32;not&#32;created&#32;yet.png)

In the release pipeline we want to use the existing hosting plan and registry:

```
-webAppName reactthingy -hostingPlanName linuxappserviceplan -appInsightsLocation "West Europe" -sku "S1 Standard" -registryName "svdoever" -registryLocation "West Europe" -registrySku "Standard" -imageName reactthingy:$(Build.BuildId)
```

## FAQ

### Why are the docker configuration files in the folder Web.App\Docker?

### How can I open a bash shell on my locally running Docker container?

1. Execute the command `docker ps` to see the docker id of your running container
2. Execute the command `docker exec -it <CONTAINER ID> /bin/bash`

You will now have a running bash in the folder /app.

## Learn More

You can learn more about Create React App in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

For more information on React, check out the [React documentation](https://reactjs.org/).
