import { useEffect, useState } from 'react';
// @ts-ignore Types are not up to date yet
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/RootState';
import { setLoaderServerRouteDataAction, setErrorServerRouteDataAction, setServerRouteDataAction } from './ServerRouteDataActions';
import { ApiProxyType, ApiProxy } from '../api/ApiProxy';
import { ApiServerRoutePagePerson } from '../api/types/ApiServerRoutePagePerson';
import { AsyncData } from '../store/AsyncData';

type UseServerRouteDataProps = {
    people: AsyncData<ApiServerRoutePagePerson[]>;
    loadPeople: (query?: string) => void;
};

export const useServerRouteData = (): UseServerRouteDataProps => {
    const [searchQuery, setSearchQuery] = useState('');
    const people: AsyncData<ApiServerRoutePagePerson[]> = useSelector((state: RootState) => state.ServerRoutePage.people);
    const apiProxy: ApiProxyType = ApiProxy();
    let dispatch = useDispatch();

    const fetchData = async (query: string) => {
        dispatch(setLoaderServerRouteDataAction());
        try {
            const data = await apiProxy.getServerRouteDataPeople(query);
            dispatch(setServerRoutePageAction(data.results));
        } catch (e) {
            dispatch(setErrorServerRoutePageAction(e));
        }
    };

    useEffect(() => {
        fetchData(searchQuery);
    }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps


    const loadPeople = (query?: string) => {
        setSearchQuery(query || '');
    };

    return { people, loadPeople };