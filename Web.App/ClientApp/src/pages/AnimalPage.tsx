import React from 'react';
import Header from '../sample/Header';
import Footer from '../sample/Footer';
import { Animal } from '../api/ApiClients';

type AnimalPageProps = {
    animal: Animal;
};

const AnimalPage: React.FC<AnimalPageProps> = props => 
            <>
                <Header />
                <h1>Animal page</h1>

                <div>
                    <ul>
                        <li>Name: {props.animal.name}</li>
                        <li>Max age: {props.animal.maxAge}</li>
                    </ul>
                </div>
                <Footer />
            </>;

export default AnimalPage;