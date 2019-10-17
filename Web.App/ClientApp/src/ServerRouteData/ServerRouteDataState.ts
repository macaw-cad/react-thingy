import { AsyncData } from '../store/AsyncData';
import { ServerRouteDataExtended } from './ServerRouteDataExtended';

export type ServerRouteDataState = {
    serverRouteData: AsyncData<ServerRouteDataExtended>;
};