import { Animal, Car, PageType } from '../api/WebAppClients';
import { AsyncData } from '../store/AsyncData';

export type ServerRouteData = {
    type?: PageType | undefined;
    carData?: Car | undefined;
    animalData?: Animal | undefined;
};

// The ServerRouteData as retrieved for the ServerRoute API service returns the data as available on the server.
// This data can be extended through additional calls from the React code (client-side or server-side).

export interface CarExtended extends Car {
}

export interface AnimalExtended extends Animal {
    latinName?: AsyncData<string> | undefined;
    count?: AsyncData<number> | undefined;
}
