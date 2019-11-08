import { AsyncData } from '../store/AsyncData';
import { AnimalLatinName } from '../api/ApiClients';

export type AnimalLatinNameState = {
    animalLatinName: AsyncData<AnimalLatinName>;
};