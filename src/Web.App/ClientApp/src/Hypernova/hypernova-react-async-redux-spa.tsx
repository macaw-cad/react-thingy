import React from 'react';
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
import { loadableReady } from '@loadable/component';
import { ChunkExtractor } from '@loadable/server';
import * as path from 'path';

export const renderReactAsyncReduxSpaServer = (C: React.ComponentType, store: Store<any>, applicationContextServer: ApplicationContextProviderProps) => hypernova({
    server(): (props: any) => string {
        return (props: any) => {
            const statsFile = path.resolve('./bundles/loadable-stats.json');
            const extractor = new ChunkExtractor({ statsFile });

            // Make sure we can use the relativeUrl using the memory history on SSR
            const contextHistory = new ContextHistory();
            contextHistory.setHistory(createMemoryHistory({
                initialEntries: [
                    applicationContextServer.applicationContext.relativeUrl || '/'
                ]
            }));

            if (applicationContextServer.applicationContext.firstRun) {
                StyleSheetServer.renderStatic(() => {
                    return ReactDOMServer.renderToStaticMarkup(extractor.collectChunks(<ApplicationContext.Provider value={applicationContextServer}><Provider store={store}><C /></Provider></ApplicationContext.Provider>));
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

export const renderReactAsyncReduxSpaClient = (C: React.ComponentType, reduxStoreCreator: (data: any) => Store<any>) => hypernova({
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
            loadableReady(() => {
                ReactDOM.hydrate(wrappedComponent, node);
            });
        }

        const payloadsCss: any[] = load('HypernovaCss');
        if (!!payloadsCss && payloadsCss.length > 0) {
            const { data } = payloadsCss[0];
            StyleSheet.rehydrate(data);
        }
    }
});