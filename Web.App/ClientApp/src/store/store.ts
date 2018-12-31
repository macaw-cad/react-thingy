import { createStore, combineReducers, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { Environment } from '../Environment';
import { RootState } from './RootState';
import { CounterReducer } from '../counter/CounterReducer';
import { UserReducer } from './user/UserReducer';
import { starWarsReducer } from '../starwars/StarWarsReducer';

export const history = !Environment.isServer ? createBrowserHistory() : createMemoryHistory();

const reducer = combineReducers<RootState>({
    counter: CounterReducer,
    users: UserReducer,
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