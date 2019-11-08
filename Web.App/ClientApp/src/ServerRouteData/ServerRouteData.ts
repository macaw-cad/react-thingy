import { IAnimal, ICar, PageType } from '../api/ApiClients';
import { AsyncData } from '../store/AsyncData';

export type ServerRouteData = {
    type?: PageType | undefined;
    carData?: ICar | undefined;
    animalData?: IAnimal | undefined;
};

// The ServerRouteData as retrieved for the ServerRoute API service returns the data as available on the server.
// This data can be extended through additional calls from the React code (client-side or server-side).

export interface CarExtended extends ICar {
}

export interface AnimalExtended extends IAnimal {
    latinName?: AsyncData<string> | undefined;
    count?: AsyncData<number> | undefined;
}
