import * as React from 'react';
import { Fragment } from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../store/RootState';
import { ApplicationContextConsumerProps, AsyncTaskContext, withApplicationContext, ApplicationContextConsumerType } from '../ApplicationContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Users from '../components/Users';

interface UsersStoreStateProps {
    counterValue: number;
}

interface UsersStoreActionProps {
}

type UsersAllProps = UsersStoreStateProps & UsersStoreActionProps & ApplicationContextConsumerProps;

class UsersPage extends React.Component<UsersAllProps> {
    asyncTaskContext: AsyncTaskContext;

    constructor(props: UsersAllProps) {
        super(props);

        this.asyncTaskContext = this.props.applicationContext as AsyncTaskContext;
    }

    public render() {
        return (
            <Fragment>
                <Header />
                <h1>Users page</h1>

                <div>
                    <Users applicationContext={this.asyncTaskContext as ApplicationContextConsumerType}/>
                </div>

                <div>
                    By the way, the counter value is {this.props.counterValue}
                </div>
                <Footer />
            </Fragment>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        counterValue: state.counter.value
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): UsersStoreActionProps => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplicationContext<UsersAllProps>(UsersPage));