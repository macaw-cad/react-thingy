import { StarWarsPeopleState } from './StarWarsPeopleState';
import { StarWarsActionTypes, TypeKeys } from './StarWarsActions';

const initialState: StarWarsPeopleState = {
    people: {
        loading: false,
    }
};

export function reduceStarWarsPeople(state: StarWarsPeopleState = initialState, action: StarWarsActionTypes): StarWarsPeopleState {
    switch (action.type) {
        case TypeKeys.SET_LOADER_STARWARSPEOPLE:
            return { ...state, people: { loading: true } };
        case TypeKeys.SET_STARWARSPEOPLE:
            return { ...state, people: { data: action.data, loading: false } };
        default:
            return state;
    }
}