import * as TypedRestClient from 'typed-rest-client-local';
import * as TypedRestClientHandlers from 'typed-rest-client-local/Handlers';
import { ApiUrlBuilder } from './ApiUrlBuilder';

export type ApiProxy = ServerApiProxy;

export class ServerApiProxy {
    private readonly client: TypedRestClient.RestClient;
    private readonly urlBuilder: ApiUrlBuilder;
    private readonly tokenHandler: TypedRestClientHandlers.BearerCredentialHandler;

    public constructor() {
        this.urlBuilder = new ApiUrlBuilder();
        this.tokenHandler = new TypedRestClientHandlers.BearerCredentialHandler('');
        this.client = new TypedRestClient.RestClient(
            'Web.App', undefined, [this.tokenHandler]);

        this.getStarWarsPeople = this.getStarWarsPeople.bind(this);
    }

    public async getStarWarsPeople(): Promise<string> {
        return await this.getData<string>(this.urlBuilder.getStarWarsPeople());
    }

    private async getData<T>(url: string): Promise<T> {
        try {
            const response = await this.client.get<T>(url);
            if (response.result) {
                return response.result;
            }
        } catch (e) {
            throw console.error(`API call GET '${url}' fails with code: ${e.statusCode}. Exception: ${e.toString()}`);
        }

        throw new Error(`API call '${url}' fails to return a result.`);
    }
}