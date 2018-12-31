import * as React from 'react';
import { Fragment } from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../store/RootState';
import { ApplicationContextConsumerProps, AsyncTaskContext, withApplicationContext, ApplicationContextConsumerType } from '../ApplicationContext';
import Header from '../sample/Header';
import Footer from '../sample/Footer';
import StarWarsPeople from '../starwars/StarWarsPeople';
import { StarWarsPeopleState } from '../starwars/StarWarsPeopleState';
import { FilledStarWarsState } from '../starwars/StarWarsState';

type StarWarsProps = {};

type StarWarsStoreProps = {
    people: StarWarsPeopleState;
};

type StarWarsStoreActions = {
};

type StarWarsAllProps = StarWarsProps & StarWarsStoreProps & StarWarsStoreActions & ApplicationContextConsumerProps;

class StarWarsPage extends React.Component<StarWarsAllProps> {
    private asyncTaskContext: AsyncTaskContext;

    constructor(props: StarWarsAllProps) {
        super(props);

        this.asyncTaskContext = this.props.applicationContext as AsyncTaskContext;
    }

    public render(): React.ReactNode {
        return (
            <Fragment>
                <Header />
                <h1>StarWars page</h1>

                <div>
                    <StarWarsPeople applicationContext={this.asyncTaskContext as ApplicationContextConsumerType}/>
                </div>
                <Footer />
            </Fragment>
        );
    }
}

const mapStateToProps = (state: RootState): StarWarsStoreProps => {
    const starWarsState = state.starWars as FilledStarWarsState;
    return {
        people: starWarsState.people
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): StarWarsStoreActions => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplicationContext<StarWarsAllProps>(StarWarsPage));