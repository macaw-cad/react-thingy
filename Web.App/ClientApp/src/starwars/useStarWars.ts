import { useEffect, useState, useContext } from 'react';
// @ts-ignore Types are not up to date yet
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/RootState';
import { setLoaderStarWarsAction, setErrorStarWarsAction, setStarWarsAction } from './StarWarsActions';
import { ApiProxyType, ApiProxy } from '../api/ApiProxy';
import { ApiStarWarsPerson } from '../api/types/ApiStarWarsPerson';
import { AsyncData } from '../store/AsyncData';
import { ApplicationContext } from '../ApplicationContext';
import { Environment } from '../Environment';

type UseStarWarsProps = {
    people: AsyncData<ApiStarWarsPerson[]>;
    loadPeople: (query?: string) => void;
};

export const useStarWars = (): UseStarWarsProps => {
    const [searchQuery, setSearchQuery] = useState('');
    const people: AsyncData<ApiStarWarsPerson[]> = useSelector((state: RootState) => state.starWars.people);
    const applicationContext = useContext(ApplicationContext);
    const apiProxy: ApiProxyType = ApiProxy(applicationContext.applicationContext);
    let dispatch = useDispatch();

    const fetchData = async () => {
        dispatch(setLoaderStarWarsAction());

        return new Promise(async (resolve, reject) => {
            try {
                const data = await apiProxy.getStarWarsPeople();
                dispatch(setStarWarsAction(data));
                resolve();
            } catch (e) {
                dispatch(setErrorStarWarsAction(e));
                reject(e);
            }
        });
    };

    if (Environment.isServer && applicationContext.applicationContext.firstRun) {
        applicationContext.applicationContext.addTask(fetchData());
    }

    useEffect(() => {
        fetchData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadPeople = (query?: string) => {
        setSearchQuery(query || '');
    };

    return { people, loadPeople };
};