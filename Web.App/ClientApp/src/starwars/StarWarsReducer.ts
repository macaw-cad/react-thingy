import { reduceStarWarsPeople } from './StarWarsPeopleReducer';
import { StarWarsState } from './StarWarsState';
import { AnyAction } from 'redux';

const initialStarWarsState: StarWarsState = {
  people: reduceStarWarsPeople(undefined, {} as AnyAction)
};

const starWarsCombinedReducers = (state: StarWarsState | undefined = initialStarWarsState, action: AnyAction): StarWarsState => {
  return {
    people: reduceStarWarsPeople(state.people, action)
  };
};

export function starWarsReducer(state: StarWarsState, action: AnyAction): StarWarsState {
  return starWarsCombinedReducers(state, action);
}