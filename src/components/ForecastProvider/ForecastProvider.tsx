import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react';

import { useForecastQuery } from '../../forecast';
import { Forecast, ForecastResponse } from '../../forecast/model';
import { getSimulatedData } from '../../utils/get-simulated-data';

const defaultResponse = {
    data: [],
    summary: ""
} as ForecastResponse

const context = createContext<Forecast>({
    response: {} as ForecastResponse, loading: false, onSimulate: () => void 0
});

export const useForecast = () => useContext(context).response;
export const useSimulation = () => useContext(context).onSimulate;

type ForecastProviderProps = React.PropsWithChildren<{}>;

export const ForecastProvider: React.FunctionComponent<ForecastProviderProps> = props => {
    const [response, setForecast] = useState<ForecastResponse>();
    const { isValidating, data, error } = useForecastQuery();

    useEffect(() => {
        if (data) {
            console.log(data);
            setForecast(data);
        }
    }, [data]);

    useEffect(() => {
        if (error) console.error(error);
    }, [error]);

    const onSimulate = useCallback(() => {
        setForecast(getSimulatedData());
    }, []);

    return (
        <context.Provider value={{ response: response ?? defaultResponse, loading: isValidating, onSimulate }}>
            {props.children}
        </context.Provider>
    );
};
