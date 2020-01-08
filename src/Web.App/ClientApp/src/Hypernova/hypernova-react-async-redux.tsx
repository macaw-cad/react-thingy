import React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import hypernova, { serialize, load } from 'hypernova';
import { Store } from 'redux';
import { ApplicationContext, ApplicationContextProviderProps, applicationContextClient } from '../ApplicationContext';
import { PwaAppFullHtml } from '../PwaAppFullHtml';
export const renderReactAsyncReduxServer = (name: string, C: React.ComponentType, store: Store<any>, applicationContextServer: ApplicationContextProviderProps) => hypernova({
  server(): (props: any) => string {
    return (props: any) => {
      // console.log('applicationContextServer', JSON.stringify(applicationContextServer, null, 2));
  
      // console.log('component render contents', contents);
      if (applicationContextServer.applicationContext.firstRun) {
        ReactDOMServer.renderToStaticMarkup(<ApplicationContext.Provider value={applicationContextServer}><Provider store={store}><C /></Provider></ApplicationContext.Provider>);
        return ''; // first run contents will be ignored
      } else {
        const contents = ReactDOMServer.renderToString(<ApplicationContext.Provider value={applicationContextServer}><Provider store={store}><PwaAppFullHtml><C /></PwaAppFullHtml></Provider></ApplicationContext.Provider>);
        return serialize(name, contents, store.getState());
      }
    };
  },
  client(): void {
    /* tslint:disable:no-empty */
  }
});

export const renderReactAsyncReduxClient = (name: string, C: React.ComponentType, reduxStoreCreator: (data: any) => Store<any>) => hypernova({
  server(): void {
    /* tslint:disable:no-empty */
  },
  client(): void {
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