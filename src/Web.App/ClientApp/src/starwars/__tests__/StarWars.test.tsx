import React from 'react';
import { mount } from 'enzyme';
import { StarWars } from '../StarWars';
import { Provider } from 'react-redux';
import { container, TYPE } from '../../services/container';
import { IStarWarsClient, StarWarsPerson } from '../../api/WebAppClients';
import { createStore } from 'redux';
import { reducer } from '../../store/store';

const store = createStore(reducer);

const mockStarWarsClient = (): IStarWarsClient => {
    return {
        getPeople: () => {
            return Promise.resolve<StarWarsPerson[]>([
                {
                    id: 10,
                    name: 'Obi-Wan Kenobi',
                    height: '182',
                    mass: '77',
                    hair_color: 'auburn, white',
                    skin_color: 'fair',
                    eye_color: 'blue-gray',
                    birth_year: '57BBY',
                    gender: 'male',
                    homeworld: 'http://swapi.dev/api/planets/20/',
                    created: '2014-12-10T16:16:29.192Z',
                    edited: '2014-12-20T21:17:50.325Z'
                }
            ]);
        }
    };
};

container.rebind<IStarWarsClient>(TYPE.StarWarsClient).toValue(mockStarWarsClient());

describe('StarWars', () => {

    it('should render', () => {
        // assert
        mount(
            <Provider store={store}>
                <StarWars />
            </Provider>
        );
    });

    it('should show data', (done) => {
        // arrange 
        const wrapper = mount(
            <Provider store={store}>
                <StarWars />
            </Provider>
        );

        // assert
        process.nextTick(() => {
            expect(wrapper.html()).toContain('Obi-Wan Jacobi');
            done();
        });
    });
});