import { AsyncData } from '../store/AsyncData';
import { StarWarsPerson } from '../api/ApiClients';

export type StarWarsState = {
    people: AsyncData<StarWarsPerson[]>;
};