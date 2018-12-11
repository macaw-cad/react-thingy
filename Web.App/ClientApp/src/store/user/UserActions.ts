import { UserData } from '../api';

export enum TypeKeys {
  SET_USERS = 'SET_USERS'
}

export interface SetUsersAction {
  type: TypeKeys.SET_USERS;
  payload: UserData[];
}

export type ActionTypes = 
  | SetUsersAction;

export const createSetUsersAction = (payload: UserData[]) => ({type: TypeKeys.SET_USERS, payload});