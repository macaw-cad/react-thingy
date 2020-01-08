import React from 'react';
import { Header } from '../sample/Header';
import { Footer } from '../sample/Footer';
import { Sheep } from '../sample/Sheep';
import { LaterText } from '../sample/LaterText';
import { Link } from 'react-router-dom';

export const HomePage = () => {
    return (
        <>
            <Header />
            <h1>Home page</h1>
            <h2>Sheep component</h2>
            <Sheep name="MeepMeep" />
            <h2>LaterText component</h2>
            <LaterText message="Initial text" />
            <h2>ServerRoute pages - data retrieved from server</h2>
            <ul>
                <li><Link to="/bear">/bear</Link></li>
                <li><Link to="/multipla">/multipla</Link></li>
                <li><Link to="/ford/fiesta">/ford/fiesta</Link></li>
            </ul>
            <Footer />
        </>
    );
};