import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/RootState';
import { AsyncData } from '../store/AsyncData';
import { AnimalLatinNameClient, AnimalLatinName } from '../api/ApiClients';
import { isomorphicFetch } from '../api/ApiClientIsomorphicFetch';
import { ApplicationContext } from '../ApplicationContext';
import { reduxDataLoader } from '../BaseRedux/HookLessReduxDataLoader';
import { TypeKeysBaseName } from './AnimalLatinNameActions';

type UseAnimalLatinNameProps = {
    animalLatinName: AsyncData<AnimalLatinName>;
    animalLatinNameLoader: (name: string) => void;
};

export const useAnimalLatinName = (): UseAnimalLatinNameProps => {
    const applicationContext = useContext(ApplicationContext).applicationContext;
    const dispatch = useDispatch();

    const animalLatinName = useSelector((state: RootState) => { 
        return state.animalLatinName && 
        state.animalLatinName.animalLatinName;
    });

    const animalLatinNameFetch = async (name: string): Promise<AnimalLatinName> => {
        const client = new AnimalLatinNameClient(applicationContext.baseUrl, { fetch: isomorphicFetch });
        return client.get(name);
    };

    const animalLatinNameLoader = (name: string) => { 
        reduxDataLoader<AnimalLatinName>(animalLatinNameFetch, applicationContext, dispatch, TypeKeysBaseName, name);
    };

    return { animalLatinName, animalLatinNameLoader };
};