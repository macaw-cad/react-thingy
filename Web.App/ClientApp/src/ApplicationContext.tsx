import * as React from 'react';
import { Environment } from './Environment';

export type ComponentDidRenderServerSideFunc = (applicationContextProps: ApplicationContextConsumerType) => void;

interface ApplicationContextProviderDataInternal {
    firstRun: boolean;
    componentDidRenderServerSideFuncs: ComponentDidRenderServerSideFunc[];
    tasks: Promise<any>[];
}

interface ApplicationContextConsumerFuncsInternal {
    addComponentDidRenderServerSideFunc: (func: ComponentDidRenderServerSideFunc) => void;
    addTask: (promise: Promise<any>) => void;
}
export interface ApplicationContextConsumerDataInternal {
    cssUrls: string[]; // css files to include
    jsUrls: string[]; // js files to include
    baseUrl: string; // all fetch operations without full specified url should use the baseUrl
    relativeUrl?: string; // app specific relative url
    isAmp?: boolean; // are we in an AMP context
}

// The view on ApplicationContext we see as a consumer
export type ApplicationContextConsumerType = ApplicationContextConsumerDataInternal & ApplicationContextConsumerFuncsInternal;

export interface ApplicationContextConsumerProps {
    applicationContext: ApplicationContextConsumerType;
}

// The view on ApplicationContext we see as a provider
export type ApplicationContextProviderType = ApplicationContextProviderDataInternal & ApplicationContextConsumerDataInternal & ApplicationContextConsumerFuncsInternal;

export interface ApplicationContextProviderProps {
    applicationContext: ApplicationContextProviderType;
}

// The view on ApplicationContext we see for async task execution

export interface AsyncTaskContext {
    readonly baseUrl: string;
    addTask: (promise: Promise<any>) => void;
}

// applicationContextClient is the application context that is used at the client side
export const applicationContextClient: ApplicationContextProviderProps = {
    applicationContext: {
        componentDidRenderServerSideFuncs: new Array<ComponentDidRenderServerSideFunc>(),
        tasks: new Array<Promise<any>>(),
        addComponentDidRenderServerSideFunc: (func: ComponentDidRenderServerSideFunc) => {/* ignore on client side */},
        addTask: (promise: Promise<any>) => {/* ignore on client side */},
        firstRun: false,
        cssUrls: [],
        jsUrls: [],
        baseUrl: '',
        relativeUrl: Environment.isServer ? '' : window.location.pathname + window.location.search + window.location.hash,
        isAmp: false
    }
}; 

export const defaultApplicationContext: ApplicationContextConsumerType = {
    addComponentDidRenderServerSideFunc: (func: ComponentDidRenderServerSideFunc) => {/* ignore on client side */},
    addTask: (promise: Promise<any>) => {/* ignore on client side */},
    cssUrls: [],
    jsUrls: [],
    baseUrl: '',
    relativeUrl: Environment.isServer ? '' : window.location.pathname + window.location.search + window.location.hash,
    isAmp: false
};

// ApplicationContext provides a Provider and Consumer
export const ApplicationContext = React.createContext<ApplicationContextProviderProps>({} as ApplicationContextProviderProps);

// Function to wrap a component with the application context.
export function withApplicationContext<T extends ApplicationContextConsumerProps>(Component: React.ComponentClass<T> | React.StatelessComponent<T>): React.ComponentClass<T> {
    return class ComponentWrappedWithApplicationContext extends React.Component<T & ApplicationContextConsumerProps> {
        public render(): React.ReactNode {
            return (
                <ApplicationContext.Consumer>
                    {(applicationContextProvider: ApplicationContextProviderProps) => {
                        // console.log('applicationContextProvider', applicationContextProvider);
                        if (!Environment.isServer) {
                            (window as any).applicationContext = applicationContextProvider.applicationContext;
                        }
                        return (
                        <Component 
                            {...this.props}
                            applicationContext={applicationContextProvider.applicationContext}
                        />);
                    }}
                </ApplicationContext.Consumer>
            );        
        }
    };
}