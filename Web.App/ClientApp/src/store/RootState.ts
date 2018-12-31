import { CounterState } from '../counter/CounterState';
import { UserState } from './user/UserReducer';
import { StarWarsState } from '../starwars/StarWarsState';

export interface RootState {
    counter: CounterState;
    users: UserState;
    starWars: StarWarsState;
}