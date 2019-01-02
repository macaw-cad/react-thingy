import React from 'react';
import { FilledStarWarsState } from './StarWarsState';
import { Omit } from '../types/omit';
import { RootState } from '../store/RootState';
import { StarWarsPeopleState } from './StarWarsPeopleState';
import { Dispatch } from 'react';
import { Action } from 'redux';
import { ApiStarWarsPerson } from '../api/types/ApiStarWarsPerson';
import { createLoadStarWarsPeopleAction, createSetStarWarsPeopleAction } from './StarWarsActions';
import { connect } from 'react-redux';
import { ServerApiProxy } from '../api/ServerApiProxy';
import { Environment } from '../Environment';
import { AsyncTaskContext, withApplicationContext, ApplicationContextConsumerProps } from '../ApplicationContext';

export type WithStarWarsPeopleProps = StarWarsPeopleState;

type StarWarsPeopleStoreActions = {
    loadStarWarsPeople: () => void;
    setStarWarsPeople: (people: ApiStarWarsPerson[]) => void;
};

export function withStarWarsPeople<T extends WithStarWarsPeopleProps>(WrappedComponent: React.ComponentType<T>): React.ComponentType<Omit<T, keyof WithStarWarsPeopleProps>> {
    const mapStateToProps = (state: RootState): WithStarWarsPeopleProps => {
        const starWarsState = state.starWars as FilledStarWarsState;

        return {
            people: starWarsState.people.people
        };
    };

    const mapDispatchToProps = (dispatch: Dispatch<Action>): StarWarsPeopleStoreActions => {
        return {
            loadStarWarsPeople: () => dispatch(createLoadStarWarsPeopleAction()),
            setStarWarsPeople: (people: ApiStarWarsPerson[]) => dispatch(createSetStarWarsPeopleAction(people))
        };
    };

    type WithStarWarsPeopleAllProps = WithStarWarsPeopleProps & StarWarsPeopleStoreActions & T & ApplicationContextConsumerProps;

    class WithStarWarsPeople extends React.Component<WithStarWarsPeopleAllProps> {
        private asyncTaskContext: AsyncTaskContext;
        private serverApiProxy: ServerApiProxy;

        constructor(props: WithStarWarsPeopleAllProps) {
            super(props);

            this.serverApiProxy = new ServerApiProxy(props.applicationContext.baseUrl);
            this.asyncTaskContext = this.props.applicationContext as AsyncTaskContext;

            if (Environment.isServer) {
                this.asyncTaskContext.addTask(this.getStarWarsPeopleFromApi());
            }
        }

        public componentDidMount(): void {
            setTimeout(() => {
                if (!this.props.people.data && !this.props.people.loading) {
                    this.actions.loadStarWarsPeople();
                    this.getStarWarsPeopleFromApi();
                }
            });
        }

        public render(): JSX.Element {
            return (
                <WrappedComponent {...this.props} />
            );
        }

        private getStarWarsPeopleFromApi(): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    const starWarsPeople: ApiStarWarsPerson[] = await this.serverApiProxy.getStarWarsPeople();
                    this.props.setStarWarsPeople(starWarsPeople);
                    resolve();
                } catch (error) {
                    this.props.setStarWarsPeople([]);
                    console.log('Failed to load StarWarsPeople. Offline?');
                    reject();
                }
            });
        }

        private get actions(): Readonly<StarWarsPeopleStoreActions> {
            return this.props;
        }
    }

    // @ts-ignore Getting TS errors, don't know how to fix them. It works though..    
    return connect(mapStateToProps, mapDispatchToProps)(withApplicationContext<WithStarWarsPeopleAllProps>(WithStarWarsPeople));
}