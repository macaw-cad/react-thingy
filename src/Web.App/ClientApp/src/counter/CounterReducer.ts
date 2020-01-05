import { CounterActionTypes, TypeKeys } from './CounterActions';
import { CounterState } from './CounterState';
import { Action } from 'redux';

const initialState: CounterState = {
  value: 0
};

export const CounterReducer = (state: CounterState = initialState, actionAny: Action): CounterState => {
  const action: CounterActionTypes = actionAny as CounterActionTypes;

  switch (action.type) {
    case TypeKeys.INCREMENT:
      return { ...state, value: state.value + action.payload };
    case TypeKeys.DECREMENT:
      return { ...state, value: state.value - action.payload };
    default:
      return state;
  }
};