import { Container, createWire, createResolve } from '@owja/ioc';
import { TYPE } from './types';
import { getMockDataFlags } from '../userSettings/MockDataFlags';

import { 
    IAnimalLatinNameClient, AnimalLatinNameClient,
    IServerRouteClient, ServerRouteClient, 
    IStarWarsClient, StarWarsClient
 } from '../api/ApiClients';
import { MockStarWarsClient } from '../api/MockStarWarsClient';
import { isomorphicFetch } from '../api/ApiClientIsomorphicFetch';

const getContainer = () => {
    const containerInstance = new Container();
    
    containerInstance.bind<IServerRouteClient>(TYPE.ServerRouteDataClient).to(ServerRouteClient);
    containerInstance.bind<IAnimalLatinNameClient>(TYPE.AnimalLatinNameClient).to(AnimalLatinNameClient);
    containerInstance.bind<IStarWarsClient>(TYPE.StarWarsClient).toFactory(() => {
        const mockDataFlags = getMockDataFlags();
        if (mockDataFlags && mockDataFlags.starwarsPeople) {
            return new MockStarWarsClient(containerInstance.get<string>(TYPE.MockUrl));
        } else {
            return new StarWarsClient(containerInstance.get<string>(TYPE.BaseUrl), { fetch: isomorphicFetch });
        }
    })/*.inSingletonScope()*/;

    return containerInstance;
};

const container = getContainer();
const wire = createWire(container);
const resolve = createResolve(container);

export { container, TYPE, wire, resolve };