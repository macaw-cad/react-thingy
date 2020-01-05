/**
 * @file Hypernova based component server with support for multiple bundles and async react components.
 * @author Serge van den Oever
 * @copyright Serge van den Oever, 2018
 * 
 * Configuration of the component server can be done through environment variables.
 * The following environment variables are supported:
 *
 * process.env.ComponentServerBundles: 
 * ===================================
 * Configuration of component bundles loaded by the component server.
 * One or more component bundles can be specified.
 * A component bundle specification consists of a bundle name and a bundle path.
 * The bundle name is a simple string that can be used as a property name.
 * The bundle path can be relative to the componentserver.js file (this file) or a http(s) path.
 * When a relative bundle path is given it must begin with ./ or ../.
 * A component is specified in the context of a bundle, i.e.: pwa:MyComponent. When a component
 * is specified without a bundle name prefix, a bundle withe the name 'default' is assumed.
 * A bundle is a node commonjs bundle.
 * Example of a ComponentServerBundles configuration:
 * 
 * process.env.ComponentServerBundles = JSON.stringify({
 *     default: './server-bundle',
 *     pwa: './server-bundle',
 *     pwaremote: 'http://myserver.com/server-bundle.js'
 * });
 * 
 * When the component server is run as a Docker image, the configuration can be specified using the '-e' parameter, i.e.:
 * docker run -e ComponentServerBundles="{default:'http://myserver.com/server-bundle.js'}".
 * When the Docker image is deployed to Azure Web App for Containers the ComponentServerBundles variable can be set as an app setting.
 * 
 * To render a component use a body like below:
 * 
 * Component with all the data specified:
 * 
 * {
 *     "sheep": {
 *         "name": "pwa:HypernovaSheep",
 *         "data": { "name": "Abracadabra" }
 *     }
 * }
 * 
 * Component that makes async calls:
 * 
 *     "counter": {
 *       "name": "pwa:HypernovaCounter",
 *       "data": { "counter": 5 },
 *       "metadata": {
 *          "strategy": "asyncRedux", 
 *          "timeout": 10000, 
 *          "baseUrl": "https://www.myserver.nl",
 *          "applicationContextServer": {
 *              "relativeUrl": "/in/nederland",
 *              "isAmp": false
 *          }
 *       }
 *     }
 * }
 */
// Sensible override if not specified: run in "production" mode, so logging in bundle in if (process.env.NODE_ENV === 'development') { ... } dos not execute
if (process.env.NODE_ENV === undefined) {
    process.env.NODE_ENV = 'development';
    console.log(`Variable 'NODE_ENV' not defined - using default value ${process.env.NODE_ENV}`);
}

const hypernovaSingleWorker = process.env.NODE_ENV === 'production' ? false : true; // set to true to let system like PM2 or IISNode do the scaling to multiple cores, not Hypernova itself
const debugUseLocalServerBundle = process.env.NODE_ENV === 'production' ? false : true; // set to true to "require" the local server-bundle.js so we can debug through the server bundle
const debugLog = process.env.NODE_ENV === 'production' ? false : true; // set to true to see additional logging like name of requested component
const noTimeout = process.env.NODE_ENV === 'production' ? false : true; // set to true for easier debugging, component rendering does not timeout
// Sensible override if not specified: use the local server-bundle.js
if (process.env.ComponentServerBundles === undefined) {
    process.env.ComponentServerBundles = JSON.stringify({
        pwa: './bundles/server-bundle.js'
    });
    console.log(`Variable 'ComponentServerBundles' not defined - using default value ${JSON.stringify(process.env.ComponentServerBundles)}`);
}

let bundle_to_debug = undefined;
if (debugUseLocalServerBundle) {
    bundle_to_debug = require('./bundles/server-bundle');
}

// hypernova server configuration
const defaultHypernovaPort = 8080;
const defaultTimeoutMilliseconds = 30 * 1000;

const hypernova = require('hypernova/server');

const path = require('path');
const express = require('express');
var responseTime = require('response-time');
const numeral = require('numeral');
const v8 = require('v8');
const fs = require('fs');
const has = require('has');
const createVM = require('./node_modules/hypernova/lib/createVM');

class ApplicationContextInstance /*implements ApplicationContextProviderProps*/ {
    constructor() {
        this.applicationContext = {
            componentDidRenderServerSideFuncs: new Array/*<ComponentDidRenderServerSideFunc>*/(),
            tasks: new Array/*<Promise<any>>*/(),
            firstRun: true,
            cssUrls: [],
            jsUrls: [],
            baseUrl: '',      // will be set by Hypernova based component server when SSR
            relativeUrl: '',  // will be set by Hypernova based component server when SSR
            isAmp: false,     // will be set by Hypernova based component server when SSR
            addComponentDidRenderServerSideFunc: (func/*: ComponentDidRenderServerSideFunc*/) => {
                this.applicationContext.componentDidRenderServerSideFuncs.push(func);
            },
            addTask: (promise/*: Promise<any>*/)/*: void*/ => {
                this.applicationContext.tasks.push(promise);
            }
        }
    }
}

function getHypernovaPort() {
    return process.env.PORT || defaultHypernovaPort;
}

function getTimeOutMilliseconds(metadata) {
    if (!!metadata && !!metadata.timeout) {
        return metadata.timeout;
    }
    if (process.env.HypernovaAsyncComponentTimeoutMilliseconds) {
        return parseInt(process.env.HypernovaAsyncComponentTimeoutMilliseconds);
    }
    return defaultTimeoutMilliseconds;
}

function getBaseUrl(metadata) {
    if (metadata && metadata.baseUrl) {
        return metadata.baseUrl;
    }
    if (process.env.HypernovaFetchBaseUrl) {
        return process.env.HypernovaFetchBaseUrl;
    }
    return `http://localhost:${getHypernovaPort()}`;
}

// https://github.com/aspnet/JavaScriptServices/blob/dev/src/Microsoft.AspNetCore.SpaServices/npm/aspnet-prerendering/src/Prerendering.ts
function wrapWithTimeout(promise, timeoutMilliseconds, timeoutRejectionValue) {
    return new Promise((resolve, reject) => {
        const timeoutTimer = setTimeout(() => {
            reject(timeoutRejectionValue);
        }, timeoutMilliseconds);

        promise
            .then(resolve, reject)
            .finally(() => { clearTimeout(timeoutTimer); });
    });
}

// Get a promise that returns an initialized component that is already invoked within this function to do all
// required async calls. When this promise resolves all async calls are fulfilled and the next invocation of the
// component handled by Hypernova will do the final rendering of the component based on all (async) retrieved data.
// The component is wrapped by a globally provided context initialized with the specified applicationContextServer (as
// specified in metadata.applicationContextServer) and a Redux store that is initialized with the specified data (as
// available in context.props).
function getComponentAsyncRedux(component, context) {
    const metadataApplicationContextServer = context.metadata.applicationContextServer;
    if (metadataApplicationContextServer.relativeUrl.startsWith('/sockjs-node/')) {
        return null;
    }

    // Create a component with Redux store that is initialized with the initial Redux store data and the global server context.
    let initialReduxState = context.props ? context.props : {};
    let applicationContextServer = new ApplicationContextInstance();
    applicationContextServer.applicationContext.cssUrls = metadataApplicationContextServer.cssUrls;
    applicationContextServer.applicationContext.jsUrls = metadataApplicationContextServer.jsUrls;
    applicationContextServer.applicationContext.baseUrl = getBaseUrl(context.metadata);
    applicationContextServer.applicationContext.relativeUrl = metadataApplicationContextServer.relativeUrl;
    applicationContextServer.applicationContext.isAmp = metadataApplicationContextServer.isAmp;


    const initializedComponent = component(context.props, applicationContextServer);
    if (initializedComponent) {
        if (typeof initializedComponent !== "function") {
            throw new Error("getComponentAsyncRedux(): Hypernova component with strategy 'asyncRedux' should return an initializedComponent as a function.")
        }
    }

    let taskCompletionPromiseResolve;
    let taskCompletionPromiseReject;
    const taskCompletionPromise = new Promise((resolve, reject) => {
        taskCompletionPromiseResolve = resolve;
        taskCompletionPromiseReject = reject;
    });

    // First render of the initialized component - should register promises using addTask 
	if (initializedComponent) {
		initializedComponent();
	}
    applicationContextServer.applicationContext.firstRun = false;

    // Execute all registered componentDidRender funcs
    applicationContextServer.applicationContext.componentDidRenderServerSideFuncs.forEach(func => {
        func(applicationContextServer.applicationContext);
    });

    // Create promise that wait for completion of all registered tasks, wrap with timeout is specified
    const waitForAllTasksPromise = Promise.all(applicationContextServer.applicationContext.tasks);
    const timeoutInMilliseconds = getTimeOutMilliseconds(context.metadata);
    let taskCompletionPromiseWithTimeout = waitForAllTasksPromise;
    if (!noTimeout && timeoutInMilliseconds > 0) {
        taskCompletionPromiseWithTimeout = wrapWithTimeout(waitForAllTasksPromise, timeoutInMilliseconds, `Component rendering time exceeded timeout value of ${timeoutInMilliseconds} milliseconds.`);
    }

    // When all registered task promises are completed do the final rendering, reject on error or timeout
    taskCompletionPromiseWithTimeout.then(successResult => {
        taskCompletionPromiseResolve(initializedComponent);
    }, error => {
        taskCompletionPromiseReject(error);
    });

    // return the promise that will resolve in the component to be rendered, or reject in case of error or timeout
    return taskCompletionPromise;
}

// This function takes in an Object of files and an Object that configures the VM. It will return
// a function that can be used as `getComponent` for Hypernova.
// The file's object structure is [componenPrefix]: 'bundle.js', i.e.: { "pwa": "server-bundle.js" }
function createCustomGetComponent(bundlesConfiguration, vmOptions, bundleLoaderPromises) {
    const http = require('http');
    const https = require('https');

    let resolvedBundles = {};

    const vm = createVM({
        cacheSize: bundlesConfiguration? Object.keys(bundlesConfiguration).length : 1,
        ...vmOptions
    });

    // bundlesConfiguration is undefined if we use the debug bundle
    if (bundlesConfiguration) {
        for (let bundleName in bundlesConfiguration) {
            let bundlePath = bundlesConfiguration[bundleName];
            if (bundlePath.startsWith("http")) {
                let client = http;
                if (bundlePath.toString().indexOf("https") === 0) {
                    client = https;
                }

                const promise = new Promise((resolve, reject) => {
                    // Load the bundle on startup so we can cache its exports.
                    request = client.get(bundlePath, res => {
                        if (res.statusCode === 200 && res.headers['content-type'].includes('javascript')) {
                            let code = '';
                            res.setEncoding('utf8');
                            res.on('data', chunk => { code += chunk; });
                            res.on('end', () => {
                                try {
                                    vm.run(bundlePath, code);
                        
                                    // Cache the code as well as the path to it.
                                    resolvedBundles[bundleName] = { // eslint-disable-line no-param-reassign
                                        bundlePath,
                                        code,
                                    };
                                    console.log(`Loaded remote bundle '${bundleName}' from path '${bundlePath}'`);
                                    resolve();
                                    } catch (err) {
                                    // If loading the component failed then we'll skip it.
                                    // istanbul ignore next
                                    reject(new Error(`Failed to compile bundle '${bundleName}' from path '${bundlePath}'`));
                                }
                            });
                        } else {
                            reject(new Error(`Failed to load remote bundle '${bundleName}' from path '${bundlePath}' (${res.statusCode};content-type=${res.headers['content-type']})`));
                        }
                    });

                    request.on('error', reject);
                    request.end();
                });
                bundleLoaderPromises.push(promise);
            } else {
                try {
                    // Load the bundle on startup so we can cache its exports.
                    const code = fs.readFileSync(bundlePath, 'utf-8');
                    
                    vm.run(bundlePath, code);
        
                    // Cache the code as well as the path to it.
                    resolvedBundles[bundleName] = { // eslint-disable-line no-param-reassign
                        bundlePath,
                        code,
                    };
                } catch (error) {
                    // If loading the component failed then we'll skip it.
                    // istanbul ignore next
                    console.error(new Error(`Failed to load local bundle '${bundleName}' from path '${bundlePath}'. Error: ${error.message}`));
                }
                
                // resolvedBundles[bundleName] = require(bundlePath);
                console.log(`Loaded local bundle '${bundleName}' from path '${bundlePath}'`);
            }
        }
    }

    return (componentSpecifier, context) => {
        if (debugLog) { console.log(`Requested component: ${componentSpecifier}`); }

        let bundleName, componentName, component;
        if (componentSpecifier.includes(':')) {
            const parts = componentSpecifier.split(':');
            if (parts[0] === '') {
                bundleName = 'default';
                componentName = parts[1];
            } else {
                bundleName = parts[0];
                componentName = parts[1];
            }
        } else {
            bundleName = 'default';
            componentName = componentSpecifier;
        }

        if (typeof bundle_to_debug !== 'undefined' && bundle_to_debug) {
            console.log(`Using 'bundle_to_debug' to resolve requested component '${componentSpecifier}' as component '${componentName}'.`);
            component = bundle_to_debug[componentName];
            bundleName = 'bundle_to_debug';
        } else {
            if (has(resolvedBundles, bundleName)) {
                const { filePath, code } = resolvedBundles[bundleName];
                const bundle = vm.run(bundleName, code);
                component = bundle[componentName];
            } else {
                throw new Error(`getComponent(): Bundle '${bundleName}' not found.`);
            }
        }

        if (!component) {
            throw new Error(`getComponent(): Hypernova component '${componentName}' not found in bundle '${bundleName}'.`);
        }
    
        if (typeof component !== "function") {
            throw new Error(`getComponent(): Hypernova component '${componentName}' is found in bundle '${bundleName}' but it is not a function.`);
        }

        if (!context.metadata || !context.metadata.strategy) {
            return component;
        }
    
        switch (context.metadata.strategy) {
            case "asyncRedux":
                return getComponentAsyncRedux(component, context);
            default:
                return component;
        }
    };
};


/****************** APPLICATION ENTRY POINT ******************/
console.log('Hypernova based component server running node version: ' + process.version);
console.log("Environment settings:");
console.log(`ComponentServerBundles=${process.env['ComponentServerBundles']}`);
console.log(`NODE_ENV=${process.env['NODE_ENV']}`);

let bundleLoaderPromises = []; // all promises that must be resolved so we know all required server bundles are loaded
let bundlesConfiguration;

if (typeof bundle_to_debug === 'undefined') {
    if (!process.env.ComponentServerBundles) {
        console.error("Environment variable process.env.ComponentServerBundles is missing. Should contain definition of bundles, i.e.: { pwa: './server-bundle.js', stories: 'http://myserver.com/story-bundle.js' }");
        process.exit(1);
    }

    try {
        bundlesConfiguration = JSON.parse(process.env.ComponentServerBundles);
    } catch (error) {
        console.error(`Failed to parse process.env.ComponentServerBundles due to error: ${error.message}.\nCurrent value: ${process.env.ComponentServerBundles}`);
        process.exit(1);
    }
} else {
    // We don't need to load bundles, overridden by: let bundle_to_debug = "./server-bundle.js"
    console.log("Using configured bundle_to_debug");
}

let app = hypernova({
    devMode: hypernovaSingleWorker,
    getComponent: createCustomGetComponent(bundlesConfiguration, {}, bundleLoaderPromises),
    port: getHypernovaPort()
});

Promise.all(bundleLoaderPromises).then(() => {
    bundleLoaderPromises = null;

    app.use(responseTime());

    app.get('/', (req, res) => {
        res.send("Available commands: GET: /alive, GET: /mem, GET: /info, POST: /batch (Hypernova component server format)");
    });
    app.get('/alive', (req, res) => {
        res.send("Component Service is alive.");
    });
    app.get('/mem', (req, res) => {
        const { rss, heapTotal, heapUsed } = process.memoryUsage();
        res.setHeader('Content-Type', 'application/json');
        res.send(`{
  "link1": "https://www.dynatrace.com/news/blog/understanding-garbage-collection-and-hunting-memory-leaks-in-node-js/",
  "rss (Resident Set Size - total space allocates in memory)": "${numeral(rss).format('0.00 ib')}", 
  "heapTotal (Total Size of the Heap)": "${numeral(heapTotal).format('0.00 ib')}",
  "heapUsed (Heap actually Used)": "${numeral(heapUsed).format('0.00 ib')}",
  
  "rss": "${rss}",
  "heapTotal": "${heapTotal}",
  "heapUsed": "${heapUsed}",
  "space": ${JSON.stringify(v8.getHeapSpaceStatistics(), null, 2)}
}`);
    })
    app.use('/info', express.static(path.join(__dirname, 'creationinfo.txt')));

}).catch(reason => {
    console.error(reason.message);
    process.exit(1);
});