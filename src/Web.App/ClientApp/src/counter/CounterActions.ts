export enum TypeKeys {
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT'
}

export interface IncrementAction {
  type: TypeKeys.INCREMENT;
  payload: number;
}

export interface DecrementAction {
    type: TypeKeys.DECREMENT;
    payload: number;
  }
  
export type CounterActionTypes = 
  | IncrementAction
  | DecrementAction;

export const increment = (payload: number) => ({type: TypeKeys.INCREMENT, payload});
export const decrement = (payload: number) => ({type: TypeKeys.DECREMENT, payload});