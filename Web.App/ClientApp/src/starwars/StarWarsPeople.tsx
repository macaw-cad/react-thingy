import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../store/RootState';
import { ApplicationContextConsumerProps, AsyncTaskContext, withApplicationContext } from '../ApplicationContext';
import { Environment } from '../Environment';
import { ServerApiProxy } from '../api/ServerApiProxy';
import { ApiStarWarsPerson } from '../api/types/ApiStarWarsPerson';
import { createSetStarWarsPeopleAction } from './StarWarsActions';
import { AsyncData } from '../store/api';

type StarWarsPeopleProps = {

};

type StarWarsPeopleStoreProps = {
    people: AsyncData<ApiStarWarsPerson[]> | null;
};

type StarWarsPeopleStoreActions = {
    setStarWarsPeople: (starwars: ApiStarWarsPerson[]) => void;
};

type StarWarsPeopleAllProps = StarWarsPeopleProps & StarWarsPeopleStoreProps & StarWarsPeopleStoreActions & ApplicationContextConsumerProps;

class StarWarsPeople extends React.Component<StarWarsPeopleAllProps> {
    private asyncTaskContext: AsyncTaskContext;
    private serverApiProxy: ServerApiProxy;
  
    constructor(props: StarWarsPeopleAllProps) {
      super(props);
  
      this.serverApiProxy = new ServerApiProxy();
      this.asyncTaskContext = this.props.applicationContext as AsyncTaskContext;
  
      if (Environment.isServer) {
        props.applicationContext.addComponentDidRenderServerSideFunc(this.loadStarWarsPeople.bind(this));
      }
    }

    public componentDidMount(): void {
        this.loadStarWarsPeople();
    }

    private async loadStarWarsPeople(): Promise<string> {
        var starWarsPeoplePromise = this.serverApiProxy.getStarWarsPeople();
        this.asyncTaskContext.addTask(starWarsPeoplePromise);

        return starWarsPeoplePromise;
    }

    public render(): React.ReactNode {
        return(<div />);
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        people: state.starWars.people
    };
};
      
const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        setStarWarsPeople: (people: ApiStarWarsPerson[]) => dispatch(createSetStarWarsPeopleAction(people))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplicationContext<StarWarsPeopleAllProps>(StarWarsPeople));