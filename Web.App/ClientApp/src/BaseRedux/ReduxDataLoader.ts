import { ApplicationContextProviderProps, ApplicationContext } from '../ApplicationContext';
import { Environment } from '../Environment';
import { useDispatch } from 'react-redux';
import { useContext } from 'react';

export const setLoaderTAction = <T>(postfix: string) => ({ type: 'SET_LOADER_' + postfix });
export const setErrorTAction = <T>(postfix: string, error: string) => ({ type: 'SET_ERROR_' + postfix, error });
export const setDataTAction = <T>(postfix: string, data: T | null) => ({ type: 'SET_DATA_' + postfix, data }); 

export const useReduxDataLoader = <T>(dataLoader: () => Promise<T>, postfix: string): () => Promise<unknown> => {
    const dispatch = useDispatch();
    const applicationContext = useContext(ApplicationContext);
    
    const reduxDataLoader = (): Promise<unknown> => {
        dispatch(setLoaderTAction<T>(postfix));
        const dataLoaderPromise = new Promise(async (resolve, reject) => {
            try {
                const data: T = await dataLoader();
                dispatch(setDataTAction<T>(postfix, data));
                resolve();
            } catch (e) {
                dispatch(setErrorTAction<T>(postfix, e));
                reject();
            }
        });
        if (Environment.isServer && applicationContext.applicationContext.firstRun) {
            applicationContext.applicationContext.addTask(dataLoaderPromise);
        }

        return dataLoaderPromise;
    };

    if (Environment.isServer && applicationContext.applicationContext.firstRun) {
        reduxDataLoader(); // execute once at server
    }

    return reduxDataLoader;
};