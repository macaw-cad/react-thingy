import { AsyncTaskContext } from './../ApplicationContext';
import { ApiStarWarsPerson } from './types/ApiStarWarsPerson';
import { ServerApiProxy } from './ServerApiProxy';
import { MockDataFlags } from '../userSettings/MockDataFlags';
import { Environment } from '../Environment';
import { ServerRoute } from './types/ServerRoute';

export class MockApiProxy {
    private readonly mockDataFlags: MockDataFlags;
    private readonly serverApiProxy: ServerApiProxy;
    private readonly mockDataPath: string;

    public constructor(applicationContext: AsyncTaskContext, mockDataFlags: MockDataFlags) {
        this.mockDataFlags = mockDataFlags;
        this.serverApiProxy = new ServerApiProxy(applicationContext);
        this.mockDataPath = Environment.isProduction ? `${applicationContext.baseUrl}/mockapi` : `http://localhost:3001`;

        this.getStarWarsPeople = this.getStarWarsPeople.bind(this);
    }

    public async getStarWarsPeople(): Promise<ApiStarWarsPerson[]> {
        if (this.mockDataFlags.starwarsPeople) {
            return await this.serverApiProxy.getData<ApiStarWarsPerson[]>(`${this.mockDataPath}/starwars-people`);
        } else {
            return this.serverApiProxy.getStarWarsPeople();
        }
    }

    public async getServerRoute(path: string): Promise<ServerRoute> {
        if (this.mockDataFlags.serverRoute) {
            if (path === '/bear') {
                return await this.serverApiProxy.getData<ServerRoute>(`${this.mockDataPath}/serverdata-bear`);
            } else if (path === 'multipla') {
                return await this.serverApiProxy.getData<ServerRoute>(`${this.mockDataPath}/serverdata-multipla`);
            } else {
                return await this.serverApiProxy.getData<ServerRoute>(`${this.mockDataPath}/serverdata-404`);
            }
        } else {
            return this.serverApiProxy.getServerRoute(path);
        }
    }
}