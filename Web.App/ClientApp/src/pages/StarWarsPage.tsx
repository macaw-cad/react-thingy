import * as React from 'react';
import Header from '../sample/Header';
import Footer from '../sample/Footer';
import { StarWars } from '../starwars/StarWars';

class StarWarsPage extends React.Component {
    public render(): JSX.Element {
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
    }
}

export default StarWarsPage;