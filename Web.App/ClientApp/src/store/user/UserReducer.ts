import { UserActionTypes, TypeKeys } from './UserActions';
import { UserData } from '../api';
import { Action } from 'redux';

export interface UserState {
  readonly users: UserData[] | null; // null = not loaded yet, [] = failed to load
}

const initialState: UserState = { users: null };

export const UserReducer = (state = initialState, actionAny: Action): UserState => {
  const action: UserActionTypes = actionAny as UserActionTypes;
  switch (action.type) {
    case TypeKeys.SET_USERS:
      return { ...state, users: action.payload };
    default:
      return state;
  }
};