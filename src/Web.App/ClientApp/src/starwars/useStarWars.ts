import { useEffect, useContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/RootState';
import { TypeKeysBaseName } from './StarWarsActions';
import { AsyncData } from '../store/AsyncData';
import { ApplicationContext } from '../ApplicationContext';
import { reduxDataLoader } from '../BaseRedux/ReduxDataLoader';
import { IStarWarsClient, StarWarsPerson } from '../api/WebAppClients';
import { TYPE, resolve } from '../services/container';
import { Environment } from '../Environment';

type UseStarWarsProps = {
    starWarsPeople: AsyncData<StarWarsPerson[]>;
    loadStarWarsPeople: (query: string) => void;
};

export const useStarWars = (): UseStarWarsProps => {
    const applicationContext = useContext(ApplicationContext).applicationContext;
    const dispatch = useDispatch();
    const isHydrated = useSelector((state: RootState) => state.page.isHydrated);
    const firstRenderWithData = useRef(true);
    const starWarsClient = resolve<IStarWarsClient>(TYPE.StarWarsClient);

    const starWarsPeople: AsyncData<StarWarsPerson[]> = useSelector((state: RootState) => state.starWars.people);

    const starWarsPeopleFetch = async (query: string): Promise<StarWarsPerson[]> => {
        return starWarsClient().getPeople(query);
    };

    const loadStarWarsPeople = async (query: string = '') => {
        reduxDataLoader<StarWarsPerson[]>(starWarsPeopleFetch, applicationContext, dispatch, TypeKeysBaseName, query);
    };

    if (Environment.isServer) {
        loadStarWarsPeople();
    }

    useEffect(() => {
        const notFirstRenderOrNoData = !firstRenderWithData.current || !starWarsPeople.data;
        const isClientSideRendered = !isHydrated;

        if (notFirstRenderOrNoData || isClientSideRendered) {
            loadStarWarsPeople();
        } else {
            firstRenderWithData.current = false;
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return { starWarsPeople, loadStarWarsPeople };
};