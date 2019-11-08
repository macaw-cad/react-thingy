import { useEffect,  useContext } from 'react';
// @ts-ignore Types are not up to date yet
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/RootState';
import { TypeKeysBaseName } from './StarWarsActions';
import { AsyncData } from '../store/AsyncData';
import { ApplicationContext } from '../ApplicationContext';
import { reduxDataLoader } from '../BaseRedux/HookLessReduxDataLoader';
import { IStarWarsClient, StarWarsPerson } from '../api/ApiClients';
import { TYPE, resolve } from '../services/container';

type UseStarWarsProps = {
    starWarsPeople: AsyncData<StarWarsPerson[]>;
    starWarsPeopleLoader: () => void;
};

export const useStarWars = (): UseStarWarsProps => {
    const applicationContext = useContext(ApplicationContext).applicationContext;
    const dispatch = useDispatch();

    const starWarsClient = resolve<IStarWarsClient>(TYPE.StarWarsClient);

    const starWarsPeople: AsyncData<StarWarsPerson[]> = useSelector((state: RootState) => state.starWars.people);

    const starWarsPeopleFetch = async (): Promise<StarWarsPerson[]> => {
        return starWarsClient().getPeople();
    };

    const starWarsPeopleLoader = async () => {
        reduxDataLoader<StarWarsPerson[]>(starWarsPeopleFetch, applicationContext, dispatch, TypeKeysBaseName);
    };

    useEffect(() => {
        starWarsPeopleLoader();
    },        []); // eslint-disable-line react-hooks/exhaustive-deps

    return { starWarsPeople, starWarsPeopleLoader };
};