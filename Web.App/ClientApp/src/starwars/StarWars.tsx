import React from 'react';
import { useStarWars } from './useStarWars';

export const StarWars: React.FC = (): JSX.Element => {
    const { people, loadPeople } = useStarWars();

    return (
        <div>
            <h1>StarWars list</h1>

            <button onClick={() => loadPeople('r2')}>Filter data</button>

            {people.loading && <div>Loading</div>}
            {people.error && <div>Error!: {people.error.toString()}</div>}
            {people.data &&
                <ul>
                    {people.data.map((person, index) => (
                        <li key={index}>{person.name}</li>
                    ))}
                </ul>
            }
        </div>
    );
};