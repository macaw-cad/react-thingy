import React, { useState } from 'react';
import { useStarWars } from './useStarWars';

export const StarWars: React.FC = () => {
    const [filter, setFilter] = useState('');
    const { starWarsPeople, loadStarWarsPeople } = useStarWars();

    return (
        <div>
            <h1>StarWars list</h1>

            <input type="text" value={filter} onChange={e => setFilter(e.target.value)} />
            <button onClick={() => loadStarWarsPeople(filter)}>Filter data</button>

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