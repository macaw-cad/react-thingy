# Documentation on using Docker

## Introduction

The Web.App solution is designed to run in a Docker container. This Docker container can run locally, 
on Azure or any system that can run Docker images.

The image consists of three running services:

1. A .NET Core 2.2 based web server running on port 80
2. A HypernovaComponentServer using the embed server-bundle.js for server-side rendering of:
   - components
   - the complete SPA application with any route
   - AMP pages
3. A jsonserver for serving mock data - so switch to mock data can be done on the fly

The image also includes an SSH server configured to be connected to the SSH web interface in an Azure Web App if the container
is deployed to an Azure Linux Web App for Containers.

The [Dockerfile](../Docker/Dockerfile) is a multi-stage Dockerfile that does both the building of all code and creation of the
Docker image.

## Scripts

There is a set of scripts available to build, run and push the Docker image. This is for development and testing only, normally these operations are performed in the build pipeline of the CI/CD environment.

The scripts use the configuration in ```envSolution.bat``` and ```env.<USERNAME>.bat``` for tagging the image and for deployment.

The following scripts are available:

- ```Docker\PreviewUserEnvironment.bat``` - See the configuration settings

- ```Docker\DockerBuildWebApp.bat``` - Build the Web.App Docker image

- ```Docker\DockerRunWebApp.bat``` - Run the Web.App Docker image locally

- ```Docker\DockerPushWebApp.bat``` - Push the Web.App Docker image to the configured repository

## Docker image registry

There are multiple choices for a Docker image registry, for example the registry of the company behind Docker and the Azure container registry.


## Azure Web App for Containers

Azure provides a simple way to run your Docker image using [Web App for Containers](https://docs.microsoft.com/en-us/azure/app-service/containers/).

Required setting to expose the correct port 80 of the .NET Core web server: ```WEBSITES_PORT: 80``` (Azure Web App for Containers uses automatic port detection and otherwise selects the wrong port). See [Azure App Service on Linux FAQ](https://docs.microsoft.com/en-us/azure/app-service/containers/app-service-linux-faq) for more information.

