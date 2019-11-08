import { Container, createWire, createResolve } from '@owja/ioc';
import { TYPE } from './types';
import { getMockDataFlags, MockDataFlags } from '../userSettings/MockDataFlags';

import { 
    IAnimalLatinNameClient, AnimalLatinNameClient,
    IServerRouteClient, ServerRouteClient, 
    IStarWarsClient, StarWarsClient
 } from '../api/ApiClients';
import { MockStarWarsClient } from '../api/MockStarWarsClient';

const getContainer = () => {
    const containerInstance = new Container();

    containerInstance.bind<IServerRouteClient>(TYPE.ServerRouteDataClient).to(ServerRouteClient);
    containerInstance.bind<IAnimalLatinNameClient>(TYPE.AnimalLatinNameClient).to(AnimalLatinNameClient);
    containerInstance.bind<IStarWarsClient>(TYPE.StarWarsClient).toFactory(() => {
        const mockDataFlags: MockDataFlags | null = getMockDataFlags();
        if (mockDataFlags && mockDataFlags.starwarsPeople) {
            return new MockStarWarsClient('http://localhost:3001');
        } else {
            return new StarWarsClient();
        }
    });

    return containerInstance;
};

const container = getContainer();
const wire = createWire(container);
const resolve = createResolve(container);

export { container, TYPE, wire, resolve };