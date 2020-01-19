import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/RootState';
import { AsyncData } from '../store/AsyncData';
import { AnimalLatinName, IAnimalLatinNameClient } from '../api/WebAppClients';
import { ApplicationContext } from '../ApplicationContext';
import { reduxDataLoader } from '../BaseRedux/ReduxDataLoader';
import { TypeKeysBaseName } from './AnimalLatinNameActions';
import { resolve, TYPE } from '../services/container';
import { useMutex } from 'react-context-mutex';

type UseAnimalLatinNameProps = {
    animalLatinName: AsyncData<AnimalLatinName>;
    loadAnimalLatinName: (name: string) => void;
};

export const useAnimalLatinName = (): UseAnimalLatinNameProps => {
    const applicationContext = useContext(ApplicationContext).applicationContext;
    const dispatch = useDispatch();
    const MutexRunner = useMutex();

    const animalLatinNameClient = resolve<IAnimalLatinNameClient>(TYPE.AnimalLatinNameClient);

    const animalLatinName = useSelector((state: RootState) => {
        return state.animalLatinName &&
            state.animalLatinName.animalLatinName;
    });

    const animalLatinNameFetch = async (name: string): Promise<AnimalLatinName> => {
        return animalLatinNameClient().get(name);
    };

    const loadAnimalLatinName = (name: string) => {
        reduxDataLoader<AnimalLatinName>(
            animalLatinNameFetch, 
            applicationContext, 
            dispatch, 
            MutexRunner,
            TypeKeysBaseName, 
            name
        );
    };

    return { animalLatinName, loadAnimalLatinName };
};