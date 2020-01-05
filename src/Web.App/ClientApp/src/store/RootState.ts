import { PageState } from './page/PageState';
import { CounterState } from '../counter/CounterState';
import { StarWarsState } from '../starwars/StarWarsState';
import { ServerRouteDataState } from '../ServerRouteData/ServerRouteDataState';
import { AnimalLatinNameState } from '../AnimalLatinName/AnimalLatinNameState';

export interface RootState {
    page: PageState; // part of base system - we always have a page state
    counter: CounterState;
    starWars: StarWarsState;
    serverRouteData: ServerRouteDataState;
    animalLatinName: AnimalLatinNameState;
}