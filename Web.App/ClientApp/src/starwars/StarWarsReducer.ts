import { reduceStarWarsPeople } from './StarWarsPeopleReducer';
import { StarWarsState } from './StarWarsState';

const initialStarWarsState: StarWarsState = {
  people: reduceStarWarsPeople(undefined, {} as any)
};

const starWarsCombinedReducers = (state: StarWarsState = initialStarWarsState, action: any): StarWarsState => {
  return {
    people: reduceStarWarsPeople(state.people, action)
  };
};

export function starWarsReducer(state: StarWarsState, action: any): StarWarsState {
  return starWarsCombinedReducers(state, action) as StarWarsState;
}