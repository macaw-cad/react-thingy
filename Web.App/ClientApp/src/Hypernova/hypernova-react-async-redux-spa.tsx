import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import hypernova, { load } from 'hypernova';
import { Store } from 'redux';
import { ApplicationContext, ApplicationContextProviderProps, applicationContextClient } from '../ApplicationContext';
import { StyleSheetServer } from 'aphrodite';
import { PwaAppFullHtml } from '../PwaAppFullHtml';

export const renderReactAsyncReduxSpaServer = (C: React.ComponentClass<any>, store: Store<any>, applicationContextServer: ApplicationContextProviderProps) => hypernova({
  server(): (props: any) => string {
    return (props: any) => {
      // console.log('applicationContextServer', JSON.stringify(applicationContextServer, null, 2));
  
      // console.log('component render contents', contents);
      if (applicationContextServer.applicationContext.firstRun) {
        const {html, css} = StyleSheetServer.renderStatic(() => {
          return ReactDOMServer.renderToStaticMarkup(<ApplicationContext.Provider value={applicationContextServer}><Provider store={store}><C /></Provider></ApplicationContext.Provider>);
        });
        return ''; // first run contents will be ignored
      } else {
        const  {html, css} = StyleSheetServer.renderStatic(() => {
          return ReactDOMServer.renderToString(<ApplicationContext.Provider value={applicationContextServer}><Provider store={store}><PwaAppFullHtml><C /></PwaAppFullHtml></Provider></ApplicationContext.Provider>);
        });
        // let processedHtml = html.replace('</body>', `<script>StyleSheet.rehydrate(${JSON.stringify(css.renderedClassNames)});</script></body>`);
        let processedHtml = html;
        processedHtml = processedHtml.replace('<div id="REDUX_STATE"></div>', '<!--' + JSON.stringify(store.getState()) + '-->');
        return processedHtml;
      }
    };
  },
  client(): void {
    /* tslint:disable:no-empty */
  }
});

export const renderReactAsyncReduxSpaClient = (C: React.ComponentClass<any>, reduxStoreCreator: (data: any) => Store<any>) => hypernova({
  server(): void {
    /* tslint:disable:no-empty */
  },
  client(): void {
    const payloads: any[] = load('HypernovaApp');
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