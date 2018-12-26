# Development tooling

## Docker commands

The ```Docker``` solution folder contains batch files to start the different Docker image related
actions like:



To run these scripts directly from the Visual Studio solution explorer install the Visual studio 
extension [Open Command Line](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.OpenCommandLine)

# Debugging
Install nodemon (```npm install nodemon -g```)

# Visual Studio Code extensions
**Debugger for Chrome** extension

# Production deployment checklist

## Remove css and js map files
In the creation of the JavaScript and CSS bundles by Create React App ```.map``` files are created.
These are used during debugging and provide a full source code view in the Chrome developer tools.
There is even a plugin TODO:name of plugin to recreate all source files from the map files.
When it is important to protect the source code in the production deployment the map files
and references to the map files must be removed. Preferably in the release pipeline so the same
build result can be used for dev, test and production. See https://github.com/facebook/create-react-app/issues/1341 for a discussion on this topic.
