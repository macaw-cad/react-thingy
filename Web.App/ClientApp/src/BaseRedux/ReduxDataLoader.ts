import { ApplicationContext } from '../ApplicationContext';
import { Environment } from '../Environment';
import { useDispatch } from 'react-redux';
import { useContext } from 'react';

export const setLoaderTAction = <T>(postfix: string) => ({ type: 'SET_LOADER_' + postfix });
export const setErrorTAction = <T>(postfix: string, error: string) => ({ type: 'SET_ERROR_' + postfix, error });
export const setDataTAction = <T>(postfix: string, data: T | null) => ({ type: 'SET_DATA_' + postfix, data }); 

export const useReduxDataLoader = <T>(dataLoader: (...args: any[]) => Promise<T>, postfix: string, ...useArgs: any): () => Promise<void> => {
    const dispatch = useDispatch();
    const applicationContext = useContext(ApplicationContext);
    
    const reduxDataLoader = (...args: any[]): Promise<void> => {
        dispatch(setLoaderTAction<T>(postfix));
        const dataLoaderPromise = new Promise<void>(async (resolve, reject) => {
            try {
                const data: T = await dataLoader(...args);
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
        reduxDataLoader(...useArgs); // execute once at server
    }

    return reduxDataLoader;
};