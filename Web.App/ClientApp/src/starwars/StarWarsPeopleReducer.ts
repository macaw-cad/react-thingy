import { StarWarsPeopleState } from './StarWarsPeopleState';
import { SetStarWarsPeopleAction, StarWarsActionTypes, TypeKeys, SetLoaderStarWarsPeopleAction } from './StarWarsActions';
import { Action } from 'redux';

const initialState: StarWarsPeopleState = {
    people: {
        loading: false,
    }
};

export function reduceStarWarsPeople(state: StarWarsPeopleState = initialState, actionAny: Action): StarWarsPeopleState {
    const action: StarWarsActionTypes = actionAny as StarWarsActionTypes;

    switch (action.type) {
        case TypeKeys.SET_LOADER_STARWARSPEOPLE:
            return reduceSetLoaderStarWarsPeopleAction(state, action);
        case TypeKeys.SET_STARWARSPEOPLE:
            return reduceSetStarWarsPeopleAction(state, action);
        default:
            return state;
    }
}

export function reduceSetLoaderStarWarsPeopleAction(state: StarWarsPeopleState, action: SetLoaderStarWarsPeopleAction): StarWarsPeopleState {
    return  { ...state, people: { loading: true } };
}

export function reduceSetStarWarsPeopleAction(state: StarWarsPeopleState, action: SetStarWarsPeopleAction): StarWarsPeopleState {
    return  { ...state, people: { data: action.data, loading: false } };
}