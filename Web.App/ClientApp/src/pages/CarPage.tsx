import React from 'react';
import Header from '../sample/Header';
import Footer from '../sample/Footer';
import { Car } from '../api/ApiClients';
import { Link } from 'react-router-dom';

type CarPageProps = {
    car: Car;
};

const CarPage: React.FC<CarPageProps> = props => 
            <>
                <Header />
                <h1>Car page</h1>

                <div>
                    <ul>
                        <li>Make: {props.car.make}</li>
                        <li>Year: {props.car.year}</li>
                        <li>Speed: {props.car.speed}</li>
                    </ul>
                </div>
                <h3>Available cars:</h3>
                <ul>
                    <li><Link to="/multipla">Multipla</Link></li>
                    <li><Link to="/ford/fiesta">Ford Fiesta</Link></li>
                </ul>
                <Footer />
            </>;

export default CarPage;