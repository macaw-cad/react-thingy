import { RouterState } from 'react-router-redux';
import { CounterState } from "../counter/CounterState";
import { UserState } from './user/UserReducer';

export interface RootState {
    router: RouterState;
    counter: CounterState;
    user: UserState;
}