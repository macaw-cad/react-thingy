import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../store/RootState';
import { ApplicationContextConsumerProps, AsyncTaskContext, withApplicationContext } from '../ApplicationContext';
import Header from '../sample/Header';
import Footer from '../sample/Footer';
import { Sheep } from '../sample/Sheep';
import { LaterText } from '../sample/LaterText';

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
                
                <div>
                    <Sheep name="MeepMeep"/>
                </div>
                <div>
                    <LaterText message="Initial text"/>
                </div>
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