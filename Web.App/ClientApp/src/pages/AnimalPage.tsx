import React, { useEffect } from 'react';
import Header from '../sample/Header';
import Footer from '../sample/Footer';
import { useAnimalLatinName } from '../AnimalLatinName/useAnimalLatinName';
import { AsyncData } from '../store/AsyncData';
import { IAnimal, AnimalLatinName } from '../api/WebAppClients';

type AnimalPageProps = {
    animal: IAnimal;
};

const AnimalPage: React.FC<AnimalPageProps> = (props: AnimalPageProps) => {
    const { animalLatinName, loadAnimalLatinName } = useAnimalLatinName();
    
    useEffect(() => {
        loadAnimalLatinName(props.animal.name || '');
    },        [props.animal.name]); // eslint-disable-line react-hooks/exhaustive-deps

    const latinName = animalLatinNameToString(animalLatinName);
    return (
        <>
            <Header />
            <h1>Animal page</h1>

            <div>
                <ul>
                    <li>Name: {props.animal.name}</li>
                    <li>Latin Name: {latinName}</li>
                    <li>Max age: {props.animal.maxAge}</li>
                </ul>
            </div>
            <Footer />
        </>
    );
};

const animalLatinNameToString = (animalLatinName: AsyncData<AnimalLatinName> | null | undefined): string => {
    if (!animalLatinName || !animalLatinName.data || !animalLatinName.data.latinName) {
        return 'waiting for translation...';
    }

    if (animalLatinName.loading) {
        return 'loading translation...';
    }

    if (animalLatinName.error) {
        return `translation error: ${animalLatinName.error.toString()}`;
    }

    return animalLatinName.data.latinName;
};

export default AnimalPage;