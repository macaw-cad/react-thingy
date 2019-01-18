import React from 'react';
import { Omit } from '../types/omit';
import { RootState } from '../store/RootState';
import { Dispatch } from 'react';
import { Action } from 'redux';
import { createSetLoader{{name}}Action, createSet{{name}}Action } from './{{name}}Actions';
import { connect } from 'react-redux';
import { ApiProxy, ApiProxyType } from '../api/ApiProxy';
import { withApplicationContext, ApplicationContextConsumerProps, AsyncTaskContext } from '../ApplicationContext';
import { Logger } from '../Logger';
import { Environment } from '../Environment';
import { {{name}}State } from './{{name}}State';
import { {{name}} } from '../api/types/{{name}}';

export type With{{name}}Props = {{name}}State & {{name}}StoreActions;

type {{name}}StoreActions = {
    setLoader{{name}}: () => void;
    set{{name}}: ({{camelCase name}}: {{name}}[] | null) => void;
};

export function with{{name}}<T extends With{{name}}Props>(WrappedComponent: React.ComponentType<T>): React.ComponentType<Omit<T, keyof With{{name}}Props>> {
    const mapStateToProps = (state: RootState): {{name}}State => {
        return {
            {{camelCase name}}: state.{{camelCase name}}.{{camelCase name}}
        };
    };

    const mapDispatchToProps = (dispatch: Dispatch<Action>): {{name}}StoreActions => {
        return {
            setLoader{{name}}: () => dispatch(createSetLoader{{name}}Action()),
            set{{name}}: ({{camelCase name}}: {{name}}[] | null) => dispatch(createSet{{name}}Action({{camelCase name}}))
        };
    };

    type With{{name}}AllProps = With{{name}}Props & {{name}}StoreActions & T & ApplicationContextConsumerProps;

    class With{{name}} extends React.Component<With{{name}}AllProps> {
        private apiProxy: ApiProxyType;
        private asyncTaskContext: AsyncTaskContext;

        constructor(props: With{{name}}AllProps) {
            super(props);

            this.apiProxy = ApiProxy(props.applicationContext);
            this.asyncTaskContext = this.props.applicationContext as AsyncTaskContext;
        
            if (Environment.isServer) {
              this.asyncTaskContext.addTask(this.get{{name}}FromApi());
            }
        }

        public componentDidMount(): void {
            setTimeout(() => {
                if (!this.props.{{camelCase name}}.data && !this.props.{{camelCase name}}.loading) {
                        this.get{{name}}FromApi();
                }
            });
        }

        public render(): JSX.Element {
            return (
                <WrappedComponent {...this.props} />
            );
        }

        private get{{name}}FromApi(): Promise<void> {
            this.actions.setLoader{{name}}();
            
            return new Promise(async (resolve, reject) => {
                try {
                    const {{camelCase name}}: {{name}}[] = await this.apiProxy.get{{name}}();
                    this.props.set{{name}}({{camelCase name}});
                    resolve();
                } catch (error) {
                    this.props.set{{name}}(null);
                    reject();
                }
            });
        }

        private get actions(): Readonly<{{name}}StoreActions> {
            return this.props;
        }
    }

    // @ts-ignore Getting TS errors, don't know how to fix them. It works though..
    return connect(mapStateToProps, mapDispatchToProps)(withApplicationContext<With{{name}}AllProps>(With{{name}}));
}