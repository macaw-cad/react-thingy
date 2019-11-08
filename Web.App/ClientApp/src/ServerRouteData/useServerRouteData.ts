import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/RootState';
import { AsyncData } from '../store/AsyncData';
import { ServerRouteClient } from '../api/ApiClients';
import { isomorphicFetch } from '../api/ApiClientIsomorphicFetch';
import { ServerRouteData } from './ServerRouteData';
import { ApplicationContext } from '../ApplicationContext';
import { Environment } from '../Environment';
import { reduxDataLoader } from '../BaseRedux/HookLessReduxDataLoader';
import { TypeKeysBaseName } from './ServerRouteDataActions';

export const useServerRouteData = (): AsyncData<ServerRouteData> => {
    const applicationContext = useContext(ApplicationContext).applicationContext;
    const dispatch = useDispatch();
    const location = useLocation();

    const serverRouteData: AsyncData<ServerRouteData> = useSelector((state: RootState) => state.serverRouteData.serverRouteData);

    const serverRouteDataFetch = async (): Promise<ServerRouteData> => {
        const client = new ServerRouteClient(applicationContext.baseUrl, { fetch: isomorphicFetch });
        const path = location.pathname.substring(1); // no leading '/'
        return client.getServerRoute(path);
    };

    const serverRouteReduxDataLoader = () => {
        reduxDataLoader<ServerRouteData>(serverRouteDataFetch, applicationContext, dispatch, TypeKeysBaseName);
    };

    useEffect(() => {
        console.log(`useEffect - location.pathname=${location.pathname}, location.search=${location.search}`);

        serverRouteReduxDataLoader();
    },        [location.pathname, location.search]); // eslint-disable-line react-hooks/exhaustive-deps

    if (Environment.isServer && applicationContext.firstRun) {
        serverRouteReduxDataLoader();
    }
 
    return serverRouteData;
};