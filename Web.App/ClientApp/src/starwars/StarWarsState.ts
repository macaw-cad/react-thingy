import { AsyncData } from '../store/AsyncData';
import { StarWarsPerson } from '../api/WebAppClients';

export type StarWarsState = {
    people: AsyncData<StarWarsPerson[]>;
};