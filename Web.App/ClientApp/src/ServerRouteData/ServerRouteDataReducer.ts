import { TypeKeys, ServerRouteDataActionTypes } from './ServerRouteDataActions';
import { ServerRouteDataState } from './ServerRouteDataState';
import { asyncDataInitialState } from '../store/AsyncData';
import { baseReducer } from '../BaseRedux/BaseReducer';

const initialState: ServerRouteDataState = {
    ServerRouteData: asyncDataInitialState
};

export const ServerRoutePageReducer = (state: ServerRouteDataState = initialState, action: ServerRouteDataActionTypes) =>
    baseReducer<ServerRouteDataState>({
        state,
        action,
        typeKeys: TypeKeys,
        dataProperty: 'ServerRouteData'
    });