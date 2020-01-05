import { StarWarsPerson, IStarWarsClient } from './WebAppClients';
import { isomorphicFetch } from './ApiClientIsomorphicFetch';
import { Logger } from '../Logger';

export class MockStarWarsClient implements IStarWarsClient {    
    private readonly mockApiBaseUrl: string;

    public constructor(baseUrl: string) {
        this.mockApiBaseUrl = baseUrl;
    }

    public getPeople(): Promise<StarWarsPerson[]> {
        const getPeoplePromise = new Promise<StarWarsPerson[]>(async (resolve, reject) => {
            const url = `${this.mockApiBaseUrl}/starwars-people`;
            try {
                const response = await isomorphicFetch(url);
                resolve(response.json());
            } catch (e) {
                Logger.error(`API call GET '${url}' fails with code: ${e.statusCode}. Exception: ${e.toString()}`);
                reject(e);
            }
        });
        return getPeoplePromise;
    }
}