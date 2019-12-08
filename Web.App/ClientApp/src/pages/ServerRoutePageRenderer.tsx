import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { withApplicationContext, ApplicationContextConsumerProps } from '../ApplicationContext';
import 'isomorphic-fetch';
import { Car, Animal } from '../api/WebAppClients';
import AnimalPage from './AnimalPage';
import CarPage from './CarPage';
import { Error404 } from './404';
import { useServerRouteData } from '../ServerRouteData/useServerRouteData';

type ServerRoutePageRendererProps = RouteComponentProps<{}> & ApplicationContextConsumerProps;

const ServerRoutePageRenderer: React.FC<ServerRoutePageRendererProps> = (props) => {
    const serverRouteData = useServerRouteData();

    const pageTypeName = (serverRouteData && serverRouteData.data && serverRouteData.data.type) ? serverRouteData.data.type.name : '_unknown_';

    if (serverRouteData.loading) { return <div>loading....</div>; }

    if (serverRouteData.error) {
        return <Error404 />;
    }
 
    switch (pageTypeName) {
        case 'animal':
            return <AnimalPage animal={serverRouteData.data!.animalData as Animal} />;
        case 'car':
            return <CarPage car={serverRouteData.data!.carData as Car} />;
        default:
            return <Error404 />;
    }
};

export default withRouter(withApplicationContext(ServerRoutePageRenderer));