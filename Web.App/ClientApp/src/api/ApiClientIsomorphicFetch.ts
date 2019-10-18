import 'isomorphic-fetch';
const https = require('https');
const http = require('http');

export const isomorphicFetch = (url: RequestInfo, init?: RequestInit | undefined): Promise<Response> | undefined => {
    const requestUrl = url.toString();

    // Add agent option to prevent "unable to verify the first certificate" with self-signed request.
    // RequestInit TypeScript type definition does not contain agent, so put it on in an untyped way.
    const options: RequestInit = init ? init : {};
    (options as any).agent = requestUrl.indexOf('https') > -1 
        ? new https.Agent({ rejectUnauthorized: false })
        : new http.Agent();

    let fetchPromise: Promise<any> = new Promise((resolve, reject) => {
        fetch(requestUrl, options)
            .then(res => {
                return res;
            })
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                console.error(`API call GET '${requestUrl}' fails with code: ${error.statusCode}. Exception: ${error.toString()}`);
                reject(error);
            });
    });

    return fetchPromise;
};