import { {{name}} } from '../api/types/{{name}}';
import { Action } from 'redux';

export enum TypeKeys {
  SET_LOADER_{{constantCase name}} = 'SET_LOADER_{{constantCase name}}',
  SET_{{constantCase name}} = 'SET_{{constantCase name}}'
}

export class SetLoader{{name}}Action implements Action {
  public type!: TypeKeys.SET_LOADER_{{constantCase name}};
}

export class Set{{name}}Action implements Action {
  public type!: TypeKeys.SET_{{constantCase name}};
  public data!: {{name}}[] | null;
}

export type {{name}}ActionTypes = 
  | SetLoader{{name}}Action
  | Set{{name}}Action;
 
export const createSetLoader{{name}}Action = () => ({ type: TypeKeys.SET_LOADER_{{constantCase name}} });
export const createSet{{name}}Action = (data: {{name}}[] | null) => ({type: TypeKeys.SET_{{constantCase name}}, data: data});