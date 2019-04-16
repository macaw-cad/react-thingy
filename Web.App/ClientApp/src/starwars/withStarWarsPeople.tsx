import React from 'react';
import { FilledStarWarsState } from './StarWarsState';
import { Omit } from '../types/omit';
import { RootState } from '../store/RootState';
import { StarWarsPeopleState } from './StarWarsPeopleState';
import { Dispatch } from 'react';
import { Action } from 'redux';
import { ApiStarWarsPerson } from '../api/types/ApiStarWarsPerson';
import { createSetLoaderStarWarsPeopleAction, createSetStarWarsPeopleAction } from './StarWarsActions';
import { connect } from 'react-redux';
import { ApiProxy, ApiProxyType } from '../api/ApiProxy';
import { withApplicationContext, ApplicationContextConsumerProps, AsyncTaskContext } from '../ApplicationContext';
import { Logger } from '../Logger';
import { Environment } from '../Environment';

export type WithStarWarsPeopleProps = StarWarsPeopleState;

type StarWarsPeopleStoreActions = {
    setLoaderStarWarsPeople: () => void;
    setStarWarsPeople: (people: ApiStarWarsPerson[] | null) => void;
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
            setLoaderStarWarsPeople: () => dispatch(createSetLoaderStarWarsPeopleAction()),
            setStarWarsPeople: (people: ApiStarWarsPerson[] | null) => dispatch(createSetStarWarsPeopleAction(people))
        };
    };

    type WithStarWarsPeopleAllProps = WithStarWarsPeopleProps & StarWarsPeopleStoreActions & T & ApplicationContextConsumerProps;

    class WithStarWarsPeople extends React.Component<WithStarWarsPeopleAllProps> {
        private apiProxy: ApiProxyType;
        private asyncTaskContext: AsyncTaskContext;

        constructor(props: WithStarWarsPeopleAllProps) {
            super(props);

            this.apiProxy = ApiProxy(props.applicationContext);
            this.asyncTaskContext = this.props.applicationContext as AsyncTaskContext;

            if (Environment.isServer && props.applicationContext.firstRun) {
                this.asyncTaskContext.addTask(this.getStarWarsPeopleFromApi());
            }
        }

        public componentDidMount(): void {
            setTimeout(() => {
                if (!this.props.people.data && !this.props.people.loading) {
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
            this.actions.setLoaderStarWarsPeople();

            return new Promise(async (resolve, reject) => {
                try {
                    const starWarsPeople: ApiStarWarsPerson[] = await this.apiProxy.getStarWarsPeople();
                    this.props.setStarWarsPeople(starWarsPeople);
                    resolve();
                } catch (error) {
                    this.props.setStarWarsPeople(null);
                    reject(error);
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