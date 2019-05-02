import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import hypernova, { load } from 'hypernova';
import { Store } from 'redux';
import { ApplicationContext, ApplicationContextProviderProps, applicationContextClient } from '../ApplicationContext';
import { StyleSheetServer, StyleSheet } from 'aphrodite/no-important';
import { PwaAppFullHtml } from '../PwaAppFullHtml';
import { ContextHistory } from '../ContextHistory';
import { createMemoryHistory, createBrowserHistory } from 'history';

export const renderReactAsyncReduxSpaServer = (C: React.ComponentClass<any>, store: Store<any>, applicationContextServer: ApplicationContextProviderProps) => hypernova({
  server(): (props: any) => string {
    return (props: any) => {

      // Make sure we can use the relativeUrl using the memory history on SSR
      const contextHistory = new ContextHistory();
      contextHistory.setHistory(createMemoryHistory({
        initialEntries: [
          applicationContextServer.applicationContext.relativeUrl || '/'
        ]
      }));

      if (applicationContextServer.applicationContext.firstRun) {
        const { html, css } = StyleSheetServer.renderStatic(() => {
          return ReactDOMServer.renderToStaticMarkup(<ApplicationContext.Provider value={applicationContextServer}><Provider store={store}><C /></Provider></ApplicationContext.Provider>);
        });
        return ''; // first run contents will be ignored
      } else {
        const { html, css } = StyleSheetServer.renderStatic(() => {
          return ReactDOMServer.renderToString(<ApplicationContext.Provider value={applicationContextServer}><Provider store={store}><PwaAppFullHtml><C /></PwaAppFullHtml></Provider></ApplicationContext.Provider>);
        });
        let processedHtml = html.replace('<style data-aphrodite="true"></style>', `<style data-aphrodite>${css.content}</style>`);
        processedHtml = processedHtml.replace('<div id="REDUX_STATE"></div>', '<!--' + JSON.stringify(store.getState()) + '-->');
        processedHtml = processedHtml.replace('<div id="CSS_STATE"></div>', '<!--' + JSON.stringify(css.renderedClassNames) + '-->');
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

    const contextHistory = new ContextHistory();
    contextHistory.setHistory(createBrowserHistory());

    if (!!payloads && payloads.length > 0) {
      const { node, data } = payloads[0];
      const store = reduxStoreCreator(data);
      const wrappedComponent = <ApplicationContext.Provider value={applicationContextClient}><Provider store={store}><C /></Provider></ApplicationContext.Provider>;
      ReactDOM.hydrate(wrappedComponent, node);
    }

    const payloadsCss: any[] = load('HypernovaCss');
    if (!!payloadsCss && payloadsCss.length > 0) {
      const { data } = payloadsCss[0];
      StyleSheet.rehydrate(data);
    }
  }
});