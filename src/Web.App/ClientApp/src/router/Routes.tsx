import * as React from 'react';
import { Route, Switch, RouteComponentProps, withRouter } from 'react-router';
import HomePage from '../pages/HomePage';
import CounterPage from '../pages/CounterPage';
import StarWarsPage from '../pages/StarWarsPage';
import AmpStoriesPage from '../pages/AmpStoriesPage';
import UserSettingsPage from '../pages/UserSettingsPage';
import ServerRoutePageRenderer from '../pages/ServerRoutePageRenderer';

type RoutingParams = {};
type RoutesAllProps = RouteComponentProps<RoutingParams>;

class Routes extends React.Component<RoutesAllProps> {

    public render(): JSX.Element {
        return (
            <Switch>
                <Route path="/" exact={true} component={HomePage} />
                <Route path="/counter" exact={true} component={CounterPage} />
                <Route path="/starwars" exact={true} component={StarWarsPage} />
                <Route path="/ampstories" exact={true} component={AmpStoriesPage} />
                <Route path="/user-settings-f7977542-cf72-439d-897f-8c61e0c36dc6" exact={true} component={UserSettingsPage} />

                <Route component={ServerRoutePageRenderer} />
            </Switch>
        );
    }
}

export default withRouter(Routes);
