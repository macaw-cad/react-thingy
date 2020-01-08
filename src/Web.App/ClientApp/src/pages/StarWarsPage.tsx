import React from 'react';
import { Header } from '../sample/Header';
import { Footer } from '../sample/Footer';
import { StarWars } from '../starwars/StarWars';

type StarWarsPageProps = {
};

export const StarWarsPage: React.FC<StarWarsPageProps> = (props: StarWarsPageProps) => {
    return (
        <>
            <Header />
            <h1>StarWars page</h1>

            <div>
                <StarWars />
            </div>
            <Footer />
        </>
    );
};