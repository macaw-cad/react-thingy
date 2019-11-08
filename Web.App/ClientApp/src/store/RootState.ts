import { CounterState } from '../counter/CounterState';
import { StarWarsState } from '../starwars/StarWarsState';
import { ServerRouteDataState } from '../ServerRouteData/ServerRouteDataState';
import { AnimalLatinNameState } from '../AnimalLatinName/AnimalLatinNameState';

export interface RootState {
    counter: CounterState;
    starWars: StarWarsState;
    serverRouteData: ServerRouteDataState;
    animalLatinName: AnimalLatinNameState;
}