import React, { useEffect, useState, useContext } from 'react';
import ApplicationRoutes from './router/ApplicationRoutes';
import { Environment } from './Environment';
import { ApplicationContext } from './ApplicationContext';
import { container, TYPE } from './services/container';

const Online = ({ online, children }: { online: boolean, children: JSX.Element }): JSX.Element | null => online ? children : null;
const Offline = ({ online, children }: { online: boolean, children: JSX.Element }): JSX.Element | null => !online ? children : null;

export const PwaApp: React.FC = (props) => {
    const [isOnline, setIsOnline] = useState((!Environment.isServer) ? window.navigator.onLine : true);
    const applicationContext = useContext(ApplicationContext).applicationContext;
    
    // We now know from the application context the baseUrl - we need check if already bound because 
    // server-side rendering executes this code twice, but no check available...
    try {
        container.get<string>(TYPE.BaseUrl);
    } catch {
        container.bind<string>(TYPE.BaseUrl).toValue(Environment.isProduction ? `${applicationContext.baseUrl}/mockapi` : `http://localhost:3001`);
    }

    useEffect(() => {
        if (!Environment.isServer) {
            window.addEventListener('offline', (e) => {
                setIsOnline(false);
            });

            window.addEventListener('online', (e) => {
                setIsOnline(true);
            });
        }
    },        []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Online online={isOnline}>
                <ApplicationRoutes />
            </Online>
            <Offline online={isOnline}>
                <div>
                    You are offline
                    </div>
            </Offline>
        </>
    );
};