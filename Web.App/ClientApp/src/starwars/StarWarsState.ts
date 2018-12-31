import { StarWarsPeopleState } from './StarWarsPeopleState';

export type FilledStarWarsState = {
  people: StarWarsPeopleState;
};

export type StarWarsState = FilledStarWarsState | undefined;