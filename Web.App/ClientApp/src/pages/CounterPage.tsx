import * as React from 'react';
import { Fragment } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Counter from '../counter/Counter';
import { defaultApplicationContext } from '../ApplicationContext';

export default class CounterPage extends React.Component {
    public render() {
        return (
            <Fragment>
                <Header />
                <h1>Counter page</h1>
                <p>
                    Everytime you visit the counter page the counter will auto-increment
                    after 1000 milliseconds. You can also increment/decrement the counter
                    using the increment and decrement buttons.
                </p>

                <div>
                    <Counter applicationContext={defaultApplicationContext}/>
                </div>
                <Footer />
            </Fragment>
        );
    }
}