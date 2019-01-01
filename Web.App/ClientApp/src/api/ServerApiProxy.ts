const https = require('https');
import { ApiUrlBuilder } from './ApiUrlBuilder';
import { ApiStarWarsPerson } from './types/ApiStarWarsPerson';

import 'isomorphic-fetch';

export type ApiProxy = ServerApiProxy;

export class ServerApiProxy {
    private readonly urlBuilder: ApiUrlBuilder;

    public constructor(baseUrl: string) {
        this.urlBuilder = new ApiUrlBuilder(baseUrl);

        this.getStarWarsPeople = this.getStarWarsPeople.bind(this);
    }

    public async getStarWarsPeople(): Promise<ApiStarWarsPerson[]> {
        return await this.getData<ApiStarWarsPerson[]>(this.urlBuilder.getStarWarsPeople());
    }

    private async getData<T>(url: string): Promise<T> {
        // Add agent option to prevent "unable to verify the first certificate" with self-signed request.
        // RequestInit TypeScript type definition does not contain agent, so put it on in an untyped way.
        const options: RequestInit = {};
        (options as any).agent = new https.Agent({ rejectUnauthorized: false });

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
                    throw console.error(`API call GET '${url}' fails with code: ${error.statusCode}. Exception: ${error.toString()}`);
                    reject(error);
                });
        });
        return getDataPromise;
    }
}