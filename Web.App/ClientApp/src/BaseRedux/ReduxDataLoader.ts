import { ApplicationContextProviderType } from '../ApplicationContext';
import { Environment } from '../Environment';
import { Dispatch } from 'react';

export const setLoaderTAction = <T>(postfix: string) => ({ type: 'SET_LOADER_' + postfix });
export const setErrorTAction = <T>(postfix: string, error: string) => ({ type: 'SET_ERROR_' + postfix, error });

export const setDataTAction = <T>(postfix: string, data: T | null) => ({ type: 'SET_DATA_' + postfix, data }); 
export const reduxDataLoader = <T>(dataLoader: (...args: any[]) => Promise<T>, 
                                   applicationContext: ApplicationContextProviderType, 
                                   dispatch: Dispatch<any>,
                                   postfix: string, ...useArgs: any): void => {
    
    const reduxAwareDataLoader = (...args: any[]): Promise<void> => {
        dispatch(setLoaderTAction<T>(postfix));

        return new Promise<void>(async (resolve, reject) => {
            try {
                const data: T = await dataLoader(...args);
                dispatch(setDataTAction<T>(postfix, data));
                resolve();
            } catch (e) {
                dispatch(setErrorTAction<T>(postfix, e));
                reject();
            }
        });
    };

    if (Environment.isServer && applicationContext.firstRun) {
       applicationContext.addTask(reduxAwareDataLoader(...useArgs)); // execute once at server
    } else if (!Environment.isServer) {
        reduxAwareDataLoader(...useArgs);
    }
};