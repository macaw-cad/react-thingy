import { PageState } from './PageState';
import { ActionTypes, TypeKeys } from './PageActions';
import { Environment } from '../../Environment';

export let initialState: PageState = {
    isHydrated: Environment.isServer
};

export const PageReducer = (state = initialState, action: ActionTypes) => {
    switch (action.type) {
        case TypeKeys.SET_IS_HYDRATED:
            return { ...state, isHydrated: action.payload === undefined ? true : action.payload };
        default:
            return state;
    }
};