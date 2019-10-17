import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/RootState';
import { setLoaderServerRouteDataAction, setErrorServerRouteDataAction, setDataServerRouteDataAction } from './ServerRouteDataActions';
import { AsyncData } from '../store/AsyncData';
import { ServerRouteClient, ServerRouteData } from '../api/ApiClients';
import { ServerRouteDataExtended } from './ServerRouteDataExtended';
import { ApplicationContext } from '../ApplicationContext';
import { Environment } from '../Environment';
import 'isomorphic-fetch';
const https = require('https');
const http = require('http');

type UseServerRouteDataProps = {
    serverRouteData: AsyncData<ServerRouteDataExtended>
};

async function getData<T>(url: string): Promise<T> {
    // Add agent option to prevent "unable to verify the first certificate" with self-signed request.
    // RequestInit TypeScript type definition does not contain agent, so put it on in an untyped way.
    const options: RequestInit = {};
    (options as any).agent = url.indexOf('https') > -1 
        ? new https.Agent({ rejectUnauthorized: false })
        : new http.Agent();

    let getDataPromise: Promise<T> = new Promise((resolve, reject) => {
        fetch(url, options)
            .then(res => {
                return res;
            })
            .then(res => {
                resolve(res as any);
            })
            .catch(error => {
                console.error(`API call GET '${url}' fails with code: ${error.statusCode}. Exception: ${error.toString()}`);
                reject(error);
            });
    });

    return getDataPromise;
}

export const useServerRouteData = (): UseServerRouteDataProps => {
    const dispatch = useDispatch();
    const location = useLocation();
    const applicationContext = useContext(ApplicationContext);
    const serverRouteData: AsyncData<ServerRouteDataExtended> = useSelector((state: RootState) => state.serverRouteData.serverRouteData);

    const fetchServerRouteData = async (): Promise<void> => {
        dispatch(setLoaderServerRouteDataAction());
        // @ts-ignore
        const client = new ServerRouteClient(applicationContext.applicationContext.baseUrl, { 
            fetch: (url: RequestInfo, init?: RequestInit | undefined): Promise<Response> | undefined => {
                console.log('URL:', url); 
                console.log('INIT:', init); 
                return getData(url.toString()); 
            }
        });
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