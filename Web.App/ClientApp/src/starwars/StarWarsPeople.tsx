import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../store/RootState';
import { ApplicationContextConsumerProps, AsyncTaskContext, withApplicationContext } from '../ApplicationContext';
import { Environment } from '../Environment';
import { ServerApiProxy } from '../api/ServerApiProxy';
import { ApiStarWarsPerson } from '../api/types/ApiStarWarsPerson';
import { createSetStarWarsPeopleAction, createLoadStarWarsPeopleAction } from './StarWarsActions';
import { AsyncData } from '../store/api';
import { StarWarsPeopleState } from './StarWarsPeopleState';
import { FilledStarWarsState } from './StarWarsState';
import { ComponentStatus } from '../ui/componentStatus/ComponentStatus';

type StarWarsPeopleProps = {};

type StarWarsPeopleStoreProps = {
    people: AsyncData<ApiStarWarsPerson[]>;
};

type StarWarsPeopleStoreActions = {
    loadStarWarsPeople: () => void;
    setStarWarsPeople: (people: ApiStarWarsPerson[]) => void;
};

type StarWarsPeopleAllProps = StarWarsPeopleProps & StarWarsPeopleStoreProps & StarWarsPeopleStoreActions & ApplicationContextConsumerProps;

class StarWarsPeople extends React.Component<StarWarsPeopleAllProps> {
    private asyncTaskContext: AsyncTaskContext;
    private serverApiProxy: ServerApiProxy;
  
    constructor(props: StarWarsPeopleAllProps) {
      super(props);
  
      this.serverApiProxy = new ServerApiProxy(props.applicationContext.baseUrl);
      this.asyncTaskContext = this.props.applicationContext as AsyncTaskContext;
  
      if (Environment.isServer) {
        this.asyncTaskContext.addTask(this.getStarWarsPeopleFromApi());
      }
    }

    public componentDidMount(): void {
        this.props.loadStarWarsPeople();
        this.getStarWarsPeopleFromApi();
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

    public render(): React.ReactNode {
        const { people: { loading, data } } = this.props;
        return (
          <div>
                <h2>StarWars People</h2>
                <ComponentStatus loading={[loading]} data={[data]} message="Failed to load StarWars people"/>
                { data &&
                  <ul>
                    { data.map((person: ApiStarWarsPerson) => (
                      <li key={person.name}>
                        {person.name} - {person.weight}kg, hair: {person.hairColor}
                      </li>
                    )) }
                  </ul>
                }   
          </div>
        );    
    }
}

const mapStateToProps = (state: RootState): StarWarsPeopleStoreProps => {
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

export default connect(mapStateToProps, mapDispatchToProps)(withApplicationContext<StarWarsPeopleAllProps>(StarWarsPeople));