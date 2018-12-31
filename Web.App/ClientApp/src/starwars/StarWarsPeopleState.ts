import { ApiStarWarsPerson } from '../api/types/ApiStarWarsPerson';
import { AsyncData } from '../store/api';

export type StarWarsPeopleState = {
  readonly people: AsyncData<ApiStarWarsPerson[]>;
};