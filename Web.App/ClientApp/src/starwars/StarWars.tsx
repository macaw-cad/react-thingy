import React from 'react';
import { useStarWars } from './useStarWars';

type StarWarsProps = {
};

const StarWars: React.FC<StarWarsProps> = (props: StarWarsProps) => {
    const { starWarsPeople, starWarsPeopleLoader } = useStarWars();
    
    starWarsPeopleLoader();
    return (
        <div>
            <h1>StarWars list</h1>

            <button onClick={() => starWarsPeopleLoader()}>Filter data</button>

            {starWarsPeople.loading && <div>Loading</div>}
            {starWarsPeople.error && <div>Error!: {starWarsPeople.error.toString()}</div>}
            {starWarsPeople.data &&
                <ul>
                    {starWarsPeople.data.map((person, index) => (
                        <li key={index}>{person.name}</li>
                    ))}
                </ul>
            }
        </div>
    );
};

export default StarWars;