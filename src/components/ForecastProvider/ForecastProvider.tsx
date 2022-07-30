import React, { createContext, useContext } from 'react';

import { useForecastQuery } from '../../forecast';
import { Forecast } from '../../forecast/model';

const context = createContext<Forecast>({ data: [] });

export const useForecast = () => useContext(context).data

type ForecastProviderProps = React.PropsWithChildren<{}>;

export const ForecastProvider: React.FunctionComponent<ForecastProviderProps> = props => {
    const { data = [], error } = useForecastQuery()

    if (error) console.error(error)

    return <context.Provider value={{ data }}>{props.children}</context.Provider>;
};
