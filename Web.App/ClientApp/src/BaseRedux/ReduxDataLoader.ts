import { ApplicationContextProviderProps } from '../ApplicationContext';
import { Environment } from '../Environment';

export const setLoaderTAction = <T>(postfix: string) => ({ type: 'SET_LOADER_' + postfix });
export const setErrorTAction = <T>(postfix: string, error: string) => ({ type: 'SET_ERROR_' + postfix, error });
export const setDataTAction = <T>(postfix: string, data: T | null) => ({ type: 'SET_DATA_' + postfix, data }); 

export const reduxDataLoader = async <T>(dataLoaderFunc: () => Promise<T>, postfix: string, dispatch: (msg: any) => void, applicationContext: ApplicationContextProviderProps): Promise<T> => {
    const fetchServerRouteData = async (): Promise<void> => {
        dispatch(setLoaderTAction<T>(postfix));

        return new Promise(async (resolve, reject) => {
            try {
                const data: T = await dataLoaderFunc();
                dispatch(setDataTAction<T>(postfix, data));
                resolve();
            } catch (e) {
                dispatch(setErrorTAction<T>(postfix, e));
                reject();
            }
        });
    };

    const dataLoaderPromise = dataLoaderFunc();
    if (Environment.isServer && applicationContext.applicationContext.firstRun) {
        applicationContext.applicationContext.addTask(dataLoaderPromise);
    }

    return dataLoaderPromise;
};