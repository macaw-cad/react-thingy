import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/RootState';
import { AsyncData } from '../store/AsyncData';
import { AnimalLatinName, IAnimalLatinNameClient } from '../api/ApiClients';
import { ApplicationContext } from '../ApplicationContext';
import { reduxDataLoader } from '../BaseRedux/ReduxDataLoader';
import { TypeKeysBaseName } from './AnimalLatinNameActions';
import { resolve, TYPE } from '../services/container';

type UseAnimalLatinNameProps = {
    animalLatinName: AsyncData<AnimalLatinName>;
    loadAnimalLatinName: (name: string) => void;
};

export const useAnimalLatinName = (): UseAnimalLatinNameProps => {
    const applicationContext = useContext(ApplicationContext).applicationContext;
    const dispatch = useDispatch();

    const animalLatinNameClient = resolve<IAnimalLatinNameClient>(TYPE.AnimalLatinNameClient);

    const animalLatinName = useSelector((state: RootState) => {
        return state.animalLatinName &&
            state.animalLatinName.animalLatinName;
    });

    const animalLatinNameFetch = async (name: string): Promise<AnimalLatinName> => {
        return animalLatinNameClient().get(name);
    };

    const loadAnimalLatinName = (name: string) => {
        reduxDataLoader<AnimalLatinName>(animalLatinNameFetch, applicationContext, dispatch, TypeKeysBaseName, name);
    };

    return { animalLatinName, loadAnimalLatinName };
};