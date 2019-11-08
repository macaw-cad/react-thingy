// import { MockDataFlags } from '../userSettings/MockDataFlags';
import { Container, createWire, createResolve } from '@owja/ioc';
import { TYPE } from './types';

import { 
    IAnimalLatinNameClient, AnimalLatinName,
    IServerRouteClient, ServerRouteClient, AnimalLatinNameClient, 
    IStarWarsClient, StarWarsClient
 } from '../api/ApiClients';
// import { MockStarWarsClient } from '../api/MockStarWarsClient';
// import { AsyncTaskContext } from '../ApplicationContext';

const getContainer = (/*applicationContext: AsyncTaskContext, mockDataFlags: MockDataFlags*/) => {
    const containerInstance = new Container();

    containerInstance.bind<IServerRouteClient>(TYPE.ServerRouteDataClient).to(ServerRouteClient);
    containerInstance.bind<IAnimalLatinNameClient>(TYPE.AnimalLatinNameClient).to(AnimalLatinNameClient);
    // if (mockDataFlags.starwarsPeople) {
    //     containerInstance.bind<IStarWarsClient>(TYPE.StarWarsClient).to(MockStarWarsClient);
    // } else {
    containerInstance.bind<IStarWarsClient>(TYPE.StarWarsClient).to(StarWarsClient);
    // }

    return containerInstance;
};

const container = getContainer();
const wire = createWire(container);
const resolve = createResolve(container);

export { container, TYPE, wire, resolve };