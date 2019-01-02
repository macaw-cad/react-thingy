import * as React from 'react';
import { Fragment } from 'react';
import Header from '../sample/Header';
import Footer from '../sample/Footer';
import StarWarsPeople from '../starwars/StarWarsPeople';

class StarWarsPage extends React.Component {
    public render(): React.ReactNode {
        return (
            <Fragment>
                <Header />
                <h1>StarWars page</h1>

                <div>
                    <StarWarsPeople />
                </div>
                <Footer />
            </Fragment>
        );
    }
}

export default StarWarsPage;