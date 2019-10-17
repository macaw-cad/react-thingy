import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/RootState';
import { setLoaderServerRouteDataAction, setErrorServerRouteDataAction, setDataServerRouteDataAction } from './ServerRouteDataActions';
import { AsyncData } from '../store/AsyncData';
import { ServerRouteClient, ServerRouteData } from '../api/ApiClients';
import { isomorphicFetch } from '../api/ApiClientIsomorphicFetch';
import { ServerRouteDataExtended } from './ServerRouteDataExtended';
import { ApplicationContext } from '../ApplicationContext';
import { Environment } from '../Environment';

type UseServerRouteDataProps = {
    serverRouteData: AsyncData<ServerRouteDataExtended>
};

export const useServerRouteData = (): UseServerRouteDataProps => {
    const dispatch = useDispatch();
    const location = useLocation();
    const applicationContext = useContext(ApplicationContext);
    const serverRouteData: AsyncData<ServerRouteDataExtended> = useSelector((state: RootState) => state.serverRouteData.serverRouteData);

    const fetchServerRouteData = async (): Promise<void> => {
        dispatch(setLoaderServerRouteDataAction());
        // @ts-ignore
        const client = new ServerRouteClient(applicationContext.applicationContext.baseUrl, { fetch: isomorphicFetch });
        const path = location.pathname.substring(1); // no leading '/'

        return new Promise(async (resolve, reject) => {
            try {
                const data = await client.getServerRoute(path);
                dispatch(setDataServerRouteDataAction(data));
                resolve();
            } catch (e) {
                dispatch(setErrorServerRouteDataAction(e));
                reject();
            }
        });
    };

    if (Environment.isServer && applicationContext.applicationContext.firstRun) {
        applicationContext.applicationContext.addTask(fetchServerRouteData());
    }

    useEffect(() => {
        fetchServerRouteData();
    }, [location.pathname, location.search]); // eslint-disable-line react-hooks/exhaustive-deps

    return { serverRouteData };
}