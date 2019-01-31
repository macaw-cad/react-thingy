# React Thingy - getting started 

Welcome to **React Thingy**. a sample project where we combined learnings and best practices of
previous React projects we executed at Macaw Interactive, a Dutch Digital Agency. We don't call it a
boilerplate, a starter kit or something like that - it is the current state of best practices that
we might use for our next project (we are actually doing that right now). But for other projects
we are going to start in the future we will look at our insight in front-end development at that moment.
Things in front-end land are changing so fast! We don't want to invest in standardizing code for
all our projects because that will result in dragging a large code base into a project, where that
code must be maintained and becomes legacy the moment it is pulled in. That is why we don't give it
a hefty name, but just call it a **Thingy**.

## How to use this code base?

If you think this Thingy is useful then clone it and make it your own. Throw away the stuff you
don't use, modify the code you use. All the code is here - no dependencies on custom created nuget
or npm packages - that makes it more difficult to change the stuff. If you find issues or have 
improvement then please give us a pull request.

## The Web.App project

The provided .NET core 2.2 Web.App project is a complete configured front-end development project
containing sample code to show how it works with a real example. The project is based on a
default .NET core web site project with React as provided by Visual Studio, but we changed the
setup and configuration to extend it and move TypeScript for the font-end development.

The project combines the following technologies:

- A .NET Core 2.2 web application rendering a Single Page Application (SPA), Razor Pages and AMP pages
- The frontend project is bootstrapped with Create React App 2 (CRA2)
- All frontend code is written in TypeScript and checked with TSLint
- Hypernova based server-side rendering for single components, the complete SPA or AMP pages
- Server-side rendered SPA can be async, so components in the SPA can make async calls to retrieve data 
  or have promises to be resolved before rendering
  JSon Server based mock api
- Storybook to manage the design system

And all of this is packed into a Linux Docker image to be deployed.

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

### Generating SSL certificate
If you're getting SSL certificate issues in your browser, you might need to generate a self-signed certificate. Do that using ```dotnet dev-certs https --trust``` in the ```\Web.app``` folder. Read more about it [here](https://www.hanselman.com/blog/DevelopingLocallyWithASPNETCoreUnderHTTPSSSLAndSelfSignedCerts.aspx).

## Deploying the solution

The ```Web.App``` is deployed in a Docker container that can be run locally or deployed to a hosting platform like Azure.
See [documentation on using Docker](./documentation/Docker.md) for more information on the available scripts to build and deploy the Docker image.

## Working examples

The code provides some examples that can be found at the folowing URL's when the application is running:

- ```http://localhost:3000``` - the SPA built by CRA2, running only client-side
- ```http://localhost:5001``` - the SPA running from the DotNet Core application
- ```http://localhost:5001/React``` - Razor Page using Hypernova to render components
- ```http://localhost:5001/Story/ArtistStory?artistId=big_l``` - AMP Story

## TODO

See the [TODO](./TODO.md) file for things still to be implemented in Web.App.

## Learn More

You can learn more about Create React App in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

For more information on React, check out the [React documentation](https://reactjs.org/).
