import { SetLoaderAction, SetErrorAction, SetDataAction } from '../BaseRedux/BaseActions';
import { AnimalLatinName } from '../api/WebAppClients';

export const TypeKeysBaseName = 'ANIMALLATINNAME';
export enum TypeKeys {
    SET_LOADER = 'SET_LOADER_ANIMALLATINNAME',
    SET_ERROR = 'SET_ERROR_ANIMALLATINNAME',
    SET_DATA = 'SET_DATA_ANIMALLATINNAME'
}

export type setLoaderAnimalLatinNameAction = SetLoaderAction<TypeKeys.SET_LOADER>;
export type setErrorAnimalLatinNameAction = SetErrorAction<TypeKeys.SET_ERROR>;
export type setDataAnimalLatinNameAction = SetDataAction<TypeKeys.SET_DATA, AnimalLatinName>;

export type AnimalLatinNameActionTypes = 
    | setLoaderAnimalLatinNameAction 
    | setErrorAnimalLatinNameAction
    | setDataAnimalLatinNameAction;