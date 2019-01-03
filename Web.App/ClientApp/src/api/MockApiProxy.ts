import { AsyncTaskContext } from './../ApplicationContext';
import { mockDataStorageKey } from './../userSettings/MockDataFlags';
import { ApiStarWarsPerson } from './types/ApiStarWarsPerson';
import { ServerApiProxy } from './ServerApiProxy';
import { MockDataFlags } from '../userSettings/MockDataFlags';

const mockDataPath = `http://localhost:3001`;

export class MockApiProxy {
    private readonly mockDataFlags: MockDataFlags;
    private readonly serverApiProxy: ServerApiProxy;

    public constructor(applicationContext: AsyncTaskContext, mockDataFlags: MockDataFlags) {
        this.mockDataFlags = mockDataFlags;
        this.serverApiProxy = new ServerApiProxy(applicationContext);

        sessionStorage.setItem(mockDataStorageKey, JSON.stringify(mockDataFlags));

        this.getStarWarsPeople = this.getStarWarsPeople.bind(this);
    }

    public async getStarWarsPeople(): Promise<ApiStarWarsPerson[]> {
        if (this.mockDataFlags.starwarsPeople) {
            return await this.serverApiProxy.getData<ApiStarWarsPerson[]>(`${mockDataPath}/starwars-people`);
        } else {
            return this.serverApiProxy.getStarWarsPeople();
        }
    }
}