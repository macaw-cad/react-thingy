import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/RootState';
import { AsyncData } from '../store/AsyncData';
import { IServerRouteClient } from '../api/ApiClients';
import { ServerRouteData } from './ServerRouteData';
import { ApplicationContext } from '../ApplicationContext';
import { Environment } from '../Environment';
import { reduxDataLoader } from '../BaseRedux/ReduxDataLoader';
import { TypeKeysBaseName } from './ServerRouteDataActions';
import { resolve, TYPE } from '../services/container';

export const useServerRouteData = (): AsyncData<ServerRouteData> => {
    const applicationContext = useContext(ApplicationContext).applicationContext;
    const dispatch = useDispatch();
    const location = useLocation();

    const serverRouteClient = resolve<IServerRouteClient>(TYPE.ServerRouteDataClient);

    const serverRouteData: AsyncData<ServerRouteData> = useSelector((state: RootState) => state.serverRouteData.serverRouteData);

    const serverRouteDataFetch = async (): Promise<ServerRouteData> => {
        const path = location.pathname.substring(1); // no leading '/'
        return serverRouteClient().getServerRoute(path);
    };

    const loadServerRouteReduxData = () => {
        reduxDataLoader<ServerRouteData>(serverRouteDataFetch, applicationContext, dispatch, TypeKeysBaseName);
    };

    useEffect(() => {
        if (!serverRouteData.data && !serverRouteData.loading) {
            loadServerRouteReduxData();
        }
    }, [location.pathname, location.search]); // eslint-disable-line react-hooks/exhaustive-deps

    if (Environment.isServer) {
        loadServerRouteReduxData();
    }

    return serverRouteData;
};