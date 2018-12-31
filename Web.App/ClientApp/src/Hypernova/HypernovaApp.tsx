import { renderReactAsyncReduxSpaServer, renderReactAsyncReduxSpaClient } from './hypernova-react-async-redux-spa';
import { configureStore } from '../store/store';
import { Environment } from '../Environment';
import { PwaApp } from '../PwaApp';

export default (initialReduxStoreState: any, applicationContextServer: any) => {
  const reduxStore = configureStore(initialReduxStoreState);
  
  return renderReactAsyncReduxSpaServer(
    'HypernovaApp', // Unique component name
    PwaApp,
    reduxStore,
    applicationContextServer
  );
};

if (!Environment.isServer) {
  renderReactAsyncReduxSpaClient(
    'HypernovaApp', // Unique component name
    PwaApp as React.ComponentClass<any>,
    (data: any) => configureStore(data)
  );
}