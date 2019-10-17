import { AsyncTaskContext } from './../ApplicationContext';
import { ApiStarWarsPerson } from './types/ApiStarWarsPerson';
import { ServerApiProxy } from './ServerApiProxy';
import { MockDataFlags } from '../userSettings/MockDataFlags';
import { Environment } from '../Environment';

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
}