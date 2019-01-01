import { ApiStarWarsPerson } from '../api/types/ApiStarWarsPerson';

export enum TypeKeys {
  SET_STARWARSPEOPLE = 'SET_STARWARSPEOPLE'
}

export interface SetStarWarsPeopleAction {
  type: TypeKeys.SET_STARWARSPEOPLE;
  payload: ApiStarWarsPerson[];
}

export type StarWarsActionTypes = 
  | SetStarWarsPeopleAction;

export const createSetStarWarsPeopleAction = (payload: ApiStarWarsPerson[]) => ({type: TypeKeys.SET_STARWARSPEOPLE, payload: payload});