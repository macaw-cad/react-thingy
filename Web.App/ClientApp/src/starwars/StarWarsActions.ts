import { ApiStarWarsPerson } from '../api/types/ApiStarWarsPerson';
import { Action } from 'redux';

export enum TypeKeys {
  LOAD_STARWARSPEOPLE = 'LOAD_STARWARSPEOPLE',
  SET_STARWARSPEOPLE = 'SET_STARWARSPEOPLE'

}

export class LoadStarWarsPeopleAction implements Action {
  public type!: TypeKeys.LOAD_STARWARSPEOPLE;
}

export class SetStarWarsPeopleAction implements Action {
  public type!: TypeKeys.SET_STARWARSPEOPLE;
  public data!: ApiStarWarsPerson[] | null;
}

export type StarWarsActionTypes = 
  | LoadStarWarsPeopleAction
  | SetStarWarsPeopleAction;

export const createLoadStarWarsPeopleAction = () => ({type: TypeKeys.LOAD_STARWARSPEOPLE});
export const createSetStarWarsPeopleAction = (data: ApiStarWarsPerson[]) => ({type: TypeKeys.SET_STARWARSPEOPLE, data: data});