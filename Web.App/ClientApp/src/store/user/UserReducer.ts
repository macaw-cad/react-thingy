import { ActionTypes, TypeKeys } from './UserActions';
import { UserData } from '../api';

export interface UserState {
  readonly users: UserData[] | null; // null = not loaded yet, [] = failed to load
}

export const initState: UserState = { users: null };

export const UserReducer = (state = initState, action: ActionTypes): UserState => {
  switch (action.type) {
    case TypeKeys.SET_USERS:
      return { ...state, users: action.payload };
    default:
      return state;
  }
};