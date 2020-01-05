import { ServerRouteData } from './ServerRouteData';
import { SetLoaderAction, SetErrorAction, SetDataAction } from '../BaseRedux/BaseActions';

export const TypeKeysBaseName = 'SERVERROUTEDATA';
export enum TypeKeys {
    SET_LOADER = 'SET_LOADER_SERVERROUTEDATA',
    SET_ERROR = 'SET_ERROR_SERVERROUTEDATA',
    SET_DATA = 'SET_DATA_SERVERROUTEDATA'
}

export type setLoaderServerRouteDataAction = SetLoaderAction<TypeKeys.SET_LOADER>;
export type setErrorServerRouteDataAction = SetErrorAction<TypeKeys.SET_ERROR>;
export type setDataServerRouteDataAction = SetDataAction<TypeKeys.SET_DATA, ServerRouteData>;

export type ServerRouteDataActionTypes = 
    | setLoaderServerRouteDataAction 
    | setErrorServerRouteDataAction
    | setDataServerRouteDataAction;
