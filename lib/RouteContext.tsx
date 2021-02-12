import React from 'react';
import useRouteHistory from './../hooks/useRouteHistory';

const RouteContext = React.createContext<string|null>(null);

export function RouteContextProvider({ children }) {

    const [ oldRoute ] = useRouteHistory();

    return (
        <RouteContext.Provider value={oldRoute}>
            { children }
        </RouteContext.Provider>
    )
}

export default RouteContext;