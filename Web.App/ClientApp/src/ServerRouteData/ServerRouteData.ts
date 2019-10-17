import { IAnimal, ICar } from '../api/ApiClients';

export type ServerRouteData = {
    pageType: string;
    carData?: ExtendedCar;
    animalData?: ExtendedAnimal;
};

// The ServerRouteData as retrieved for the ServerRoute API service returns the data as available on the server.
// This data can be extended through additional calls from the React code (client-side or server-side).

interface ExtendedCar extends ICar {
}

interface ExtendedAnimal extends IAnimal {
    latinName: string;
    count: number;
}
