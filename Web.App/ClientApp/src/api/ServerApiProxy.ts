import { AsyncTaskContext } from './../ApplicationContext';
import { ApiUrlBuilder } from './ApiUrlBuilder';
import { ApiStarWarsPerson } from './types/ApiStarWarsPerson';

import 'isomorphic-fetch';
import { Logger } from '../Logger';

const https = require('https');
const http = require('http');

export class ServerApiProxy {
    private readonly urlBuilder: ApiUrlBuilder;
    private applicationContext: AsyncTaskContext;

    public constructor(applicationContext: AsyncTaskContext) {
        this.urlBuilder = new ApiUrlBuilder(applicationContext.baseUrl);
        
        this.applicationContext = applicationContext;

        this.getStarWarsPeople = this.getStarWarsPeople.bind(this);
    }

    public async getStarWarsPeople(): Promise<ApiStarWarsPerson[]> {
        return await this.getData<ApiStarWarsPerson[]>(this.urlBuilder.getStarWarsPeople());
    }

    public async getData<T>(url: string): Promise<T> {
        // Add agent option to prevent "unable to verify the first certificate" with self-signed request.
        // RequestInit TypeScript type definition does not contain agent, so put it on in an untyped way.
        const options: RequestInit = {};
        (options as any).agent = this.applicationContext.baseUrl.indexOf('https') > -1 
            ? new https.Agent({ rejectUnauthorized: false })
            : new http.Agent();

        let getDataPromise: Promise<T> = new Promise((resolve, reject) => {
            fetch(url, options)
                .then(res => {
                    const json = res.json();
                    return json;
                })
                .then(res => {
                    resolve(res as T);
                })
                .catch(error => {
                    Logger.error(`API call GET '${url}' fails with code: ${error.statusCode}. Exception: ${error.toString()}`);
                    reject(error);
                });
        });

        return getDataPromise;
    }
}