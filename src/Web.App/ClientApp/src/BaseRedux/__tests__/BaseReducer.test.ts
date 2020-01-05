import { baseReducer } from '../BaseReducer';
import { asyncDataInitialState } from '../../store/AsyncData';

describe('BaseReducer', () => {
    let state = {
        test: asyncDataInitialState
    };

    enum TypeKeys {
        SET_LOADER = 'SET_LOADER_TEST',
        SET_ERROR = 'SET_ERROR_TEST',
        SET_DATA = 'SET_DATA_TEST'
    }

    it('should set loader', () => {
        // arrange
        const inputState = baseReducer({
            state,
            action: {
                type: TypeKeys.SET_LOADER
            },
            typeKeys: TypeKeys,
            dataProperty: 'test'
        });

        const expectedState = { test: { data: null, error: null, loading: true } };

        // assert
        expect(inputState).toEqual(expectedState);
    });

    it('should set error', () => {
        // arrange
        const inputState = baseReducer({
            state,
            action: {
                type: TypeKeys.SET_ERROR,
                error: 'errorcode'
            },
            typeKeys: TypeKeys,
            dataProperty: 'test'
        });

        const expectedState = { test: { data: null, error: 'errorcode', loading: false } };

        // assert
        expect(inputState).toEqual(expectedState);
    });

    it('should set data', () => {
        // arrange
        const inputState = baseReducer({
            state,
            action: {
                type: TypeKeys.SET_DATA,
                data: 'data'
            },
            typeKeys: TypeKeys,
            dataProperty: 'test'
        });

        const expectedState = { test: { data: 'data', error: null, loading: false } };

        // assert
        expect(inputState).toEqual(expectedState);
    });
});