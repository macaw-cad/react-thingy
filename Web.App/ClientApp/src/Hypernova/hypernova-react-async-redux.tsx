import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import hypernova, { serialize, load } from 'hypernova';
import { Store } from 'redux';
import { ApplicationContext, ApplicationContextProviderProps, applicationContextClient } from '../ApplicationContext';

export const renderReactAsyncReduxServer = (name: string, C: React.ComponentClass<any>, store: Store<any>, applicationContextServer: ApplicationContextProviderProps) => hypernova({
  server() {
    return (props: any) => {
      // console.log('applicationContextServer', JSON.stringify(applicationContextServer, null, 2));
      const wrappedComponent = <ApplicationContext.Provider value={applicationContextServer}><Provider store={store}><C /></Provider></ApplicationContext.Provider>;
      const contents = ReactDOMServer.renderToString(wrappedComponent);
      // console.log('component render contents', contents);
      if (applicationContextServer.applicationContext.firstRun) {
        return ''; // first run contents will be ignored
      } else {
        return serialize(name, contents, store.getState());
      }
    };
  },
  client() {
    /* tslint:disable:no-empty */
  }
});

export const renderReactAsyncReduxClient = (name: string, C: React.ComponentClass<any>, reduxStoreCreator: (data: any) => Store<any>) => hypernova({
  server() {
    /* tslint:disable:no-empty */
  },
  client() {
    const payloads: any[] = load(name);
    if (!!payloads && payloads.length > 0) {
      if (process.env.NODE_ENV === 'development') { console.log(`renderReactAsyncReduxClient::client() with component '${name}'`); }
      payloads.forEach((payload) => {
        const { node, data } = payload;
        // console.log('applicationContextClient', applicationContextClient);
        // console.log('Redux Store', data);
        const store = reduxStoreCreator(data);
        const wrappedComponent = <ApplicationContext.Provider value={applicationContextClient}><Provider store={store}><C /></Provider></ApplicationContext.Provider>;
        ReactDOM.hydrate(wrappedComponent, node);
      });
    }
  }
});