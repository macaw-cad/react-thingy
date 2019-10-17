import { ServerRouteDataExtended } from './ServerRouteDataExtended';
import { SetLoaderAction, SetErrorAction, SetDataAction } from '../BaseRedux/BaseActions';

export enum TypeKeys {
    SET_LOADER = 'SET_LOADER_SERVERROUTEDATA',
    SET_ERROR = 'SET_ERROR_SERVERROUTEDATA',
    SET_DATA = 'SET_DATA_SERVERROUTEDATA'
}

export type setLoaderServerRouteDataAction = SetLoaderAction<TypeKeys.SET_LOADER>;
export type setErrorServerRouteDataAction = SetErrorAction<TypeKeys.SET_ERROR>;
export type setDataServerRouteDataAction = SetDataAction<TypeKeys.SET_DATA, ServerRouteDataExtended>;

export type ServerRouteDataActionTypes = 
    | setLoaderServerRouteDataAction 
    | setErrorServerRouteDataAction
    | setDataServerRouteDataAction;

export const setLoaderServerRouteDataAction = () => ({ type: TypeKeys.SET_LOADER });
export const setErrorServerRouteDataAction = (error: string) => ({ type: TypeKeys.SET_ERROR, error });
export const setDataServerRouteDataAction = (data: ServerRouteDataExtended | null) => ({ type: TypeKeys.SET_DATA, data }); 