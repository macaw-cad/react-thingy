import { createStore, combineReducers, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { RootState } from './RootState';
import { CounterReducer } from '../counter/CounterReducer';
import { starWarsReducer } from '../starwars/StarWarsReducer';

const reducer = combineReducers<RootState>({
    counter: CounterReducer,
    starWars: starWarsReducer
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