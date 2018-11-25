import { CounterActionTypes, TypeKeys } from './CounterActions';
import { CounterState } from './CounterState';

const initialState: CounterState = {
  value: 0
};

export const CounterReducer = (state: CounterState = initialState, action: CounterActionTypes): CounterState => {
  switch (action.type) {
    case TypeKeys.INCREMENT:
      return { ...state, value: state.value + action.payload };
    case TypeKeys.DECREMENT:
      return { ...state, value: state.value - action.payload };
    default:
      return state;
  }
};