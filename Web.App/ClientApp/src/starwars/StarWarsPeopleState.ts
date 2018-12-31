import { ApiStarWarsPerson } from '../api/types/ApiStarWarsPerson';
import { AsyncData } from '../store/api';

export interface StarWarsPeopleState {
    readonly people: AsyncData<ApiStarWarsPerson[]>;
  }