import * as React from 'react';
import { ApiStarWarsPerson } from '../api/types/ApiStarWarsPerson';
import { ComponentStatus } from '../ui/componentStatus/ComponentStatus';
import { withStarWarsPeople, WithStarWarsPeopleProps } from './withStarWarsPeople';

type StarWarsPeopleProps = {};

type StarWarsPeopleAllProps = StarWarsPeopleProps & WithStarWarsPeopleProps;

class StarWarsPeople extends React.Component<StarWarsPeopleAllProps> {
  public render(): React.ReactNode {
    const { people: { loading, data } } = this.props;
    return (
      <div>
        <h2>StarWars People</h2>
        <ComponentStatus loading={[loading]} data={[data]} message="Failed to load StarWars people" />
        {data &&
          <ul>
            {data.map((person: ApiStarWarsPerson) => (
              <li key={person.name}>
                {person.name} - {person.weight}kg, hair: {person.hairColor}
              </li>
            ))}
          </ul>
        }
      </div>
    );
  }
}

export default withStarWarsPeople(StarWarsPeople);