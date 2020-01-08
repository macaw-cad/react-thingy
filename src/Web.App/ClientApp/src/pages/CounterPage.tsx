import React from 'react';
import loadable from '@loadable/component';
import { Header } from '../sample/Header';
import { Footer } from '../sample/Footer';
// import Counter from '../counter/Counter';

const Counter = loadable(() => import('../counter/Counter'), {
    ssr: true,
    fallback: <div>Loading counter...</div>
});

export const CounterPage = () => {
    return (
        <>
            <Header />
            <h1>Counter page</h1>
            <p>
                Everytime you visit the counter page the counter will auto-increment
                after 1000 milliseconds. You can also increment/decrement the counter
                using the increment and decrement buttons.
                </p>

            <div>
                <Counter />
            </div>
            <Footer />
        </>
    );
};