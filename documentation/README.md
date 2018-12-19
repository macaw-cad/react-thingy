# CORE-CRA2-TS-HYPERNOVA example

This project combines the following technologies:

- A DotNet Core 2.1 web application rendering a SPA, Razor Pages and AMP pages
- The frontend project is bootstrapped with Create React App 2 (CRA2)
- All frontend code is written in TypeScript
- Single components, the complete SPA or AMP pages can be server-side rendered using Hypernova
- Server-side rendered components can be async, so they make async calls to retrieve data or have promises to be resolved before rendering

# Working with the code

When editing the DotNet Core application open the solution ```core-cra2-ts-hypernova.sln```. When the solution is started (development mode) it expects a SPA application running on http://localhost:3000.

Open the project at the root folder in Visual Studio Code, so NOT at the ```Web.App\ClientApp``` folder - otherwise thr configured debugging settings will not work.

The folder ```Web.App\ClientApp``` contains a ```package.json``` file containing commands
for running the application.

There is a "do it all" cpmmand available for frontewnd developers that don't open the DotNet Core solution:

```
npm run start-with-server
```

This command does the following:

- For the DotNet Core solution restore the package, build the solution and run the solution
- ```npm start``` - compiles the client side application using the Create React App 2 build system
- ```npm run watch:build:server-bundle``` - compiles the server bundle on each change in the ```src``` directory, this server bundle is used by the Hypernova Component Server
- ```npm run start:hypernovacomponentserver``` - starts the Hypernova Component Server with the created ```server-bundle.js``` file

When the DotNet Core solution is comp[iled and debugged in Visual Studio start the above
commands in seperate terminal windows.

It is also possible to start the Hypenova Component Server in the Visual Studio Code debugger using the debug configuration ```HypernovaServer```. Breakpoints can be set in the TypeScript source code.

# Working examples:

```http://localhost:3000``` - the SPA built by CRA2, running only client-side
```http://localhost:5001``` - the SPA running from the DotNet Core application
```http://localhost:5001/React``` - Razor Page using Hypernova to render components
```http://localhost:5001/Story/ArtistStory?artistId=big_l``` - AMP Story

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
