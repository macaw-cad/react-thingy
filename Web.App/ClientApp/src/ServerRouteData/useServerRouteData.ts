import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/RootState';
import { AsyncData } from '../store/AsyncData';
import { ServerRouteClient } from '../api/ApiClients';
import { isomorphicFetch } from '../api/ApiClientIsomorphicFetch';
import { ServerRouteDataExtended } from './ServerRouteDataExtended';
import { ApplicationContext } from '../ApplicationContext';
import { useReduxDataLoader } from '../BaseRedux/ReduxDataLoader';

export const useServerRouteData = (): AsyncData<ServerRouteDataExtended> => {
    const location = useLocation();
    const applicationContext = useContext(ApplicationContext);

    const serverRouteData: AsyncData<ServerRouteDataExtended> = useSelector((state: RootState) => state.serverRouteData.serverRouteData);
    console.log('serverRouteData', serverRouteData);

    const serverRouteDataLoader = async (): Promise<ServerRouteDataExtended> => {
        const client = new ServerRouteClient(applicationContext.applicationContext.baseUrl, { fetch: isomorphicFetch });
        const path = location.pathname.substring(1); // no leading '/'
        return client.getServerRoute(path);
    };

    const serverRouteReduxDataLoader = useReduxDataLoader<ServerRouteDataExtended>(serverRouteDataLoader, 'SERVERROUTEDATA');

    // TODO: prevent redendering on client after SSR
    useEffect(() => {
        console.log(`useEffect - location.pathname=${location.pathname}, location.search=${location.search}`);
        serverRouteReduxDataLoader();
    }, [location.pathname, location.search]); // eslint-disable-line react-hooks/exhaustive-deps

    return serverRouteData;
};