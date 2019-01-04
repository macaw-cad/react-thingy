import { AsyncTaskContext } from './../ApplicationContext';
import { ServerApiProxy } from './ServerApiProxy';
import { MockApiProxy } from './MockApiProxy';
import { getMockDataFlags } from '../userSettings/MockDataFlags';

export type ApiProxyType = ServerApiProxy | MockApiProxy;

export const ApiProxy = (applicationContext: AsyncTaskContext): ApiProxyType => {    
    const mockDataFlags = getMockDataFlags();

    if (mockDataFlags) {
        return new MockApiProxy(applicationContext, mockDataFlags);
    } else {
        return new ServerApiProxy(applicationContext);
    }
};