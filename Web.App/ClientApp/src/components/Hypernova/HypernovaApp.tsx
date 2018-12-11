import { renderReactAsyncReduxServer, renderReactAsyncReduxClient } from './hypernova-react-async-redux';
import { configureStore } from '../../store/store';
import { Environment } from '../../Environment';
import { PwaApp } from '../../PwaApp';

export default (initialReduxStoreState: any, applicationContextServer: any) => {
  const reduxStore = configureStore(initialReduxStoreState);
  
  return renderReactAsyncReduxServer(
    'HypernovaApp', // Unique component name
    PwaApp,
    reduxStore,
    applicationContextServer
  );
};

if (!Environment.isServer) {
  renderReactAsyncReduxClient(
    'HypernovaApp', // Unique component name
    PwaApp as React.ComponentClass<any>,
    (data: any) => configureStore(data)
  );
}