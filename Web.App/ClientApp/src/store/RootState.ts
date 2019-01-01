import { CounterState } from '../counter/CounterState';
import { StarWarsState } from '../starwars/StarWarsState';

export interface RootState {
    counter: CounterState;
    starWars: StarWarsState;
}