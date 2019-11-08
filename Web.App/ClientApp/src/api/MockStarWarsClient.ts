import { AsyncTaskContext } from '../ApplicationContext';
import { Environment } from '../Environment';
import { StarWarsPerson, IStarWarsClient } from './ApiClients';
import { isomorphicFetch } from './ApiClientIsomorphicFetch';
import { Logger } from '../Logger';

export class MockStarWarsClient implements IStarWarsClient {    
    private readonly mockDataPath: string;

    public constructor(applicationContext: AsyncTaskContext) {
        this.mockDataPath = Environment.isProduction ? `${applicationContext.baseUrl}/mockapi` : `http://localhost:3001`;
    }

    public getPeople(): Promise<StarWarsPerson[]> {
        const getPeoplePromise = new Promise<StarWarsPerson[]>(async (resolve, reject) => {
            const url = `${this.mockDataPath}/starwars-people`;
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