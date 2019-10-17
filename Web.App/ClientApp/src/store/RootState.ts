import { CounterState } from '../counter/CounterState';
import { StarWarsState } from '../starwars/StarWarsState';
import { ServerRouteDataState } from '../ServerRouteData/ServerRouteDataState';

export interface RootState {
    counter: CounterState;
    starWars: StarWarsState;
    serverRouteData: ServerRouteDataState; 
}