# CORE-CRA2-TS-HYPERNOVA starter

This starter is a complete configured front-end development project containing sample code to show how it works with a real example.

The project combines the following technologies:

- A .NET Core 2.2 web application rendering a SPA, Razor Pages and AMP pages
- The frontend project is bootstrapped with Create React App 2 (CRA2)
- All frontend code is written in TypeScript
- Single components, the complete SPA or AMP pages can be server-side rendered using Hypernova
- Server-side rendered components can be async, so they can make async calls to retrieve data or have promises to be resolved before rendering

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
for developing and building the application. See [README development](./README.development.md) for more information on development.

## Deploying the solution

The ```Web.App``` is deployed in a Docker container that can be run locally or deployed to a hosting platform like Azure.
See [README Docker](./README.development.md) for more information on the available scripts to build and deploy Docker images.

## Working examples

The code provides some examples that can be found at the folowing URL's when the application is running:

- ```http://localhost:3000``` - the SPA built by CRA2, running only client-side
- ```http://localhost:5001``` - the SPA running from the DotNet Core application
- ```http://localhost:5001/React``` - Razor Page using Hypernova to render components
- ```http://localhost:5001/Story/ArtistStory?artistId=big_l``` - AMP Story

## Learn More

You can learn more about Create React App in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

For more information on React, check out the [React documentation](https://reactjs.org/).
