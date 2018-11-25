import * as React from 'react';
import ApplicationRoutes from './router/ApplicationRoutes';
import { Environment } from './Environment';
type PwaAppState = {
    online: boolean,
};

const Online = ({ online, children }: { online: boolean, children: JSX.Element }): JSX.Element | null => online ? children : null;
const Offline = ({ online, children }: { online: boolean, children: JSX.Element }): JSX.Element | null => !online ? children : null;

export class PwaApp extends React.Component<{}, PwaAppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            online: (!Environment.isServer) ? window.navigator.onLine : true,
        };
    }

    componentDidMount() {
        if (!Environment.isServer) {
            window.addEventListener('offline', (e) => {
                this.setState({
                    online: false
                });
            });

            window.addEventListener('online', (e) => {
                this.setState({
                    online: true
                });
            });
        }
    }

    refreshPage() {
        if (!Environment.isServer && window.location) {
            window.location.reload();
        }
    }

    render(): JSX.Element {
        return (
            <>
                <Online online={this.state.online}>
                    <ApplicationRoutes />
                </Online>
                <Offline online={this.state.online}>
                    <div>
                        You are ofline
                    </div>
                </Offline>
            </>
        );
    }
}