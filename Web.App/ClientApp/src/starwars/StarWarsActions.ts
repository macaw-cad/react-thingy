import { ApiStarWarsPerson } from '../api/types/ApiStarWarsPerson';
import { Action } from 'redux';

export enum TypeKeys {
  SET_LOADER_STARWARSPEOPLE = 'SET_LOADER_STARWARSPEOPLE',
  SET_STARWARSPEOPLE = 'SET_STARWARSPEOPLE'
}

export class SetLoaderStarWarsPeopleAction implements Action {
  public type!: TypeKeys.SET_LOADER_STARWARSPEOPLE;
}

export class SetStarWarsPeopleAction implements Action {
  public type!: TypeKeys.SET_STARWARSPEOPLE;
  public data!: ApiStarWarsPerson[] | null;
}

export type StarWarsActionTypes = 
  | SetLoaderStarWarsPeopleAction
  | SetStarWarsPeopleAction;

export const createSetLoaderStarWarsPeopleAction = () => ({type: TypeKeys.SET_LOADER_STARWARSPEOPLE});
export const createSetStarWarsPeopleAction = (data: ApiStarWarsPerson[] | null) => ({type: TypeKeys.SET_STARWARSPEOPLE, data: data});