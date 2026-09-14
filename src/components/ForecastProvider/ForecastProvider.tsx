import React, { createContext, useContext, useEffect, useState } from 'react';

import { useForecastQuery } from '../../forecast';
import { Forecast, ForecastData } from '../../forecast/model';
import { usePosition } from '../../utils/use-position';

const context = createContext<Forecast>({
    data: [],
    loading: false,
    isAutoRefreshing: true,
    resumeAutoRefresh: () => void 0,
    refreshNow: () => void 0,
    position: undefined,
    setCoordinates: () => void 0,
    clearOverride: () => void 0,
    isOverridden: false,
    requestPosition: () => void 0,
    locationError: undefined,
});

export const useForecast = () => useContext(context).data;
export const useAutoRefresh = () => {
    const { isAutoRefreshing, resumeAutoRefresh } = useContext(context);
    return [isAutoRefreshing, resumeAutoRefresh] as const;
};
export const useLocation = () => {
    const { position, setCoordinates, clearOverride, isOverridden, refreshNow, requestPosition, locationError } =
        useContext(context);
    return [position, { setCoordinates, clearOverride, isOverridden, refreshNow, requestPosition, locationError }] as const;
};

type ForecastProviderProps = React.PropsWithChildren<{}>;

export const ForecastProvider: React.FunctionComponent<ForecastProviderProps> = props => {
    const [forecast, setForecast] = useState<ForecastData>([]);
    const [position, { setCoordinates, clearOverride, isOverridden, requestPosition, error: locationError }] =
        usePosition();
    const { isValidating, data, error, isAutoRefreshing, resumeAutoRefresh, mutate } = useForecastQuery(position);

    useEffect(() => {
        if (data) setForecast(data);
    }, [data]);

    useEffect(() => {
        if (error) console.error(error);
    }, [error]);

    return (
        <context.Provider
            value={{
                data: forecast,
                loading: isValidating,
                isAutoRefreshing,
                resumeAutoRefresh,
                refreshNow: mutate,
                position,
                setCoordinates,
                clearOverride,
                isOverridden,
                requestPosition,
                locationError,
            }}
        >
            {props.children}
        </context.Provider>
    );
};
