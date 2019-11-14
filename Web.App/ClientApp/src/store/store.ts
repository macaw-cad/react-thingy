import { createStore, combineReducers, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { RootState } from './RootState';
import { CounterReducer } from '../counter/CounterReducer';
import { starWarsReducer } from '../starwars/StarWarsReducer';
import { ServerRoutePageReducer } from '../ServerRouteData/ServerRouteDataReducer';
import { AnimalLatinNameReducer } from '../AnimalLatinName/AnimalLatinNameReducer';

export const reducer = combineReducers<RootState>({
    counter: CounterReducer,
    starWars: starWarsReducer,
    serverRouteData: ServerRoutePageReducer,
    animalLatinName: AnimalLatinNameReducer
});

export function configureStore(initialReduxStoreState: RootState | undefined = undefined): Store<RootState> {
    let store: Store<RootState>;
    if (!initialReduxStoreState) {
        store = createStore(
            reducer,
            composeWithDevTools()
        );
    } else {
        store = createStore(
            reducer,
            initialReduxStoreState,
            composeWithDevTools()
        );
    }
    return store;
}