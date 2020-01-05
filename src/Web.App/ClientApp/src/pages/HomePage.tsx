import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../store/RootState';
import { ApplicationContextConsumerProps, AsyncTaskContext, withApplicationContext } from '../ApplicationContext';
import Header from '../sample/Header';
import Footer from '../sample/Footer';
import { Sheep } from '../sample/Sheep';
import { LaterText } from '../sample/LaterText';
import { Link } from 'react-router-dom';

interface HomeStoreStateProps {
}

interface HomeStoreActionProps {
}

type HomeAllProps = HomeStoreStateProps & HomeStoreActionProps & ApplicationContextConsumerProps;

class HomePage extends React.Component<HomeAllProps> {
    private asyncTaskContext: AsyncTaskContext;

    constructor(props: HomeAllProps) {
        super(props);

        this.asyncTaskContext = this.props.applicationContext as AsyncTaskContext;
    }

    public render(): JSX.Element {
        return (
            <>
                <Header />
                <h1>Home page</h1>
                <h2>Sheep component</h2>
                <Sheep name="MeepMeep"/>
                <h2>LaterText component</h2>
                <LaterText message="Initial text"/>
                <h2>ServerRoute pages - data retrieved from server</h2>
                <ul>
                    <li><Link to="/bear">/bear</Link></li>
                    <li><Link to="/multipla">/multipla</Link></li>
                    <li><Link to="/ford/fiesta">/ford/fiesta</Link></li>
                </ul>
                <Footer />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
    };  
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): HomeStoreActionProps => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplicationContext<HomeAllProps>(HomePage));