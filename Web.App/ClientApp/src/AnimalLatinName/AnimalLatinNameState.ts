import { AsyncData } from '../store/AsyncData';
import { AnimalLatinName } from '../api/WebAppClients';

export type AnimalLatinNameState = {
    animalLatinName: AsyncData<AnimalLatinName>;
};