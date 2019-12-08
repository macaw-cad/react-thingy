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
                new StarWarsPerson({
                    name: 'Obi-Wan Jacobi',
                    weight: 77,
                    hairColor: 'auburn, white'
                })
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