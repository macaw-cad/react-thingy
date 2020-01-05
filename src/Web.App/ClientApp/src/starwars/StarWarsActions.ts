import { SetLoaderAction, SetErrorAction, SetDataAction } from '../BaseRedux/BaseActions';
import { StarWarsPerson } from '../api/WebAppClients';

export const TypeKeysBaseName = 'STARWARS';
export enum TypeKeys {
    SET_LOADER = 'SET_LOADER_STARWARS',
    SET_ERROR = 'SET_ERROR_STARWARS',
    SET_DATA = 'SET_DATA_STARWARS'
}

export type setLoaderStarWarsAction = SetLoaderAction<TypeKeys.SET_LOADER>;
export type setErrorStarWarsAction = SetErrorAction<TypeKeys.SET_ERROR>;
export type setStarWarsAction = SetDataAction<TypeKeys.SET_DATA, StarWarsPerson[]>;

export type StarWarsActionTypes = 
    | setLoaderStarWarsAction 
    | setErrorStarWarsAction
    | setStarWarsAction;