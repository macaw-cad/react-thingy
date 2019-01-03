import { AsyncTaskContext } from './../ApplicationContext';
import { Environment } from './../Environment';
import { ServerApiProxy } from './ServerApiProxy';
import { MockApiProxy } from './MockApiProxy';
import { MockDataFlags, getMockDataFlags } from '../userSettings/MockDataFlags';

export type ApiProxyType = ServerApiProxy | MockApiProxy;

export const ApiProxy = (applicationContext: AsyncTaskContext): ApiProxyType => {    
    let mockDataFlags = getMockDataFlags();

    // Session cookies
    // React route met guid
    // Component met checkboxes
    if (mockDataFlags) {
        return new MockApiProxy(applicationContext, mockDataFlags);
    } else {
        return new ServerApiProxy(applicationContext);
    }
};