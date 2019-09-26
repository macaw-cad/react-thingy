import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { withApplicationContext, ApplicationContextConsumerProps } from '../ApplicationContext';
import { ApiProxy } from '../api/ApiProxy';
import { ServerRoute as ServerRouteType } from '../api/types/ServerRoute';
import { Error404 } from './404';

type ServerRoutePageRendererProps = RouteComponentProps<{}> & ApplicationContextConsumerProps;

const ServerRoutePageRenderer: React.FC<ServerRoutePageRendererProps> = (props) => {
    const [serverRouteData, setServerRouteData] = useState<ServerRouteType>(new ServerRouteType());
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchServerRouteData = async (): Promise<ServerRouteType> => {
        const api = ApiProxy(props.applicationContext);
        const data = await api.getServerRoute(props.location.pathname);
        return data;
    };

    const serverRouteDataToState = async () => {
        const data = await fetchServerRouteData();
        setServerRouteData(data);
    };

    useEffect(() => {
        serverRouteDataToState();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps 
 
    const pageTypeName = serverRouteData.type.name;
    if (isLoading) {
        return <div>loading....</div>;
    }

    switch (pageTypeName) {
        case 'animal':
            return <p>BEAR</p>;  
        case 'car':
            return <p>MULTIPLA</p>;  
        default:
        return <Error404/>;
    }
}

export default withRouter(withApplicationContext(ServerRoutePageRenderer));