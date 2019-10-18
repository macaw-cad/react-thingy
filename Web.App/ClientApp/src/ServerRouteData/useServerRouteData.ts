import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/RootState';
import { AsyncData } from '../store/AsyncData';
import { ServerRouteClient } from '../api/ApiClients';
import { isomorphicFetch } from '../api/ApiClientIsomorphicFetch';
import { ServerRouteDataExtended } from './ServerRouteDataExtended';
import { ApplicationContext } from '../ApplicationContext';
import { reduxDataLoader } from '../BaseRedux/ReduxDataLoader';

type UseServerRouteDataProps = {
    serverRouteData: AsyncData<ServerRouteDataExtended>
};

export const useServerRouteData = (): UseServerRouteDataProps => {
    const dispatch = useDispatch();
    const applicationContext = useContext(ApplicationContext);

    const location = useLocation();
    const serverRouteData: AsyncData<ServerRouteDataExtended> = useSelector((state: RootState) => state.serverRouteData.serverRouteData);

    const reduxDataLoaderFunc = async (): Promise<ServerRouteDataExtended> => {
        const client = new ServerRouteClient(applicationContext.applicationContext.baseUrl, { fetch: isomorphicFetch });
        const path = location.pathname.substring(1); // no leading '/'
        return client.getServerRoute(path);
    };

    const fetchServerRouteData = async (): Promise<ServerRouteDataExtended> => {
        return reduxDataLoader<ServerRouteDataExtended>(reduxDataLoaderFunc, 'SERVERROUTEDATA', dispatch, applicationContext);
    };

    fetchServerRouteData();

    useEffect(() => {
        fetchServerRouteData();
    }, [location.pathname, location.search]); // eslint-disable-line react-hooks/exhaustive-deps

    return { serverRouteData };
};