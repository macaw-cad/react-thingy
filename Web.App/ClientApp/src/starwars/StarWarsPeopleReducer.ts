import { StarWarsPeopleState } from './StarWarsPeopleState';
import { SetStarWarsPeopleAction, ActionTypes, TypeKeys } from './StarWarsActions';
import { Action } from 'redux';
export const starWarsPeopleInitialState: StarWarsPeopleState = {
    people: {
        loading: false,
    }
};

export function reduceStarWarsPeople(state: StarWarsPeopleState = starWarsPeopleInitialState, actionAny: Action): StarWarsPeopleState {
    const action: ActionTypes = actionAny as ActionTypes;

    switch (action.type) {
        case TypeKeys.SET_STARWARSPEOPLE:
            return reduceSetStarWarsPeopleAction(state, action);
        default:
            return state;
    }
}

export function reduceSetStarWarsPeopleAction(state: StarWarsPeopleState, action: SetStarWarsPeopleAction): StarWarsPeopleState {
    return  { ...state, people: { data: action.payload, loading: false } };
}