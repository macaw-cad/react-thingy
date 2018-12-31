import { StarWarsPeopleState } from './StarWarsPeopleState';
import { SetStarWarsPeopleAction, StarWarsActionTypes, TypeKeys } from './StarWarsActions';
import { Action } from 'redux';

const initialState: StarWarsPeopleState = {
    people: {
        loading: false,
    }
};

export function reduceStarWarsPeople(state: StarWarsPeopleState = initialState, actionAny: Action): StarWarsPeopleState {
    const action: StarWarsActionTypes = actionAny as StarWarsActionTypes;

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