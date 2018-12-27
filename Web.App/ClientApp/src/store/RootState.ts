import { CounterState } from '../counter/CounterState';
import { UserState } from './user/UserReducer';

export interface RootState {
    counter: CounterState;
    user: UserState;
}