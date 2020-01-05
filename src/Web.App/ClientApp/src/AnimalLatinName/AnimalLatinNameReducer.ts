import { TypeKeys, AnimalLatinNameActionTypes } from './AnimalLatinNameActions';
import { AnimalLatinNameState } from './AnimalLatinNameState';
import { asyncDataInitialState } from '../store/AsyncData';
import { baseReducer } from '../BaseRedux/BaseReducer';

const initialState: AnimalLatinNameState = {
    animalLatinName: asyncDataInitialState
};

export const AnimalLatinNameReducer = (state: AnimalLatinNameState = initialState, action: AnimalLatinNameActionTypes) =>
    baseReducer<AnimalLatinNameState>({
        state,
        action,
        typeKeys: TypeKeys,
        dataProperty: 'animalLatinName'
    });