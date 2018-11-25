import { renderReactAsyncReduxServer, renderReactAsyncReduxClient } from './hypernova-react-async-redux';
import { configureStore } from '../../store/store';
import { Environment } from '../../Environment';
import Counter from '../../counter/Counter';

export default (initialReduxStoreState: any, applicationContextServer: any) => {
  const reduxStore = configureStore(initialReduxStoreState);
  
  return renderReactAsyncReduxServer(
    'HypernovaCounter', // Unique component name
    Counter,
    reduxStore,
    applicationContextServer
  );
};

if (!Environment.isServer) {
  renderReactAsyncReduxClient(
    'HypernovaCounter', // Unique component name
    Counter as React.ComponentClass<any>,
    (data: any) => configureStore(data)
  );
}