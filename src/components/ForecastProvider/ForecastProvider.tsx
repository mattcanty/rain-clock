import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react';

import { useForecastQuery } from '../../forecast';
import { Forecast, ForecastData } from '../../forecast/model';
import { getSimulatedData } from '../../utils/get-simulated-data';

const context = createContext<Forecast>({ data: [], loading: false, onSimulate: () => void 0 });

export const useForecast = () => useContext(context).data;
export const useSimulation = () => useContext(context).onSimulate;

type ForecastProviderProps = React.PropsWithChildren<{}>;

export const ForecastProvider: React.FunctionComponent<ForecastProviderProps> = props => {
    const [forecast, setForecast] = useState<ForecastData>([]);
    const { isValidating, data , error } = useForecastQuery();

    useEffect(() => {
        if(data) setForecast(data)
    }, [data])

    useEffect(() => {
        if (error) console.error(error);
    }, [error])

    const onSimulate = useCallback(() => {
        setForecast(getSimulatedData())
    }, []);

    return (
        <context.Provider value={{ data: forecast, loading: isValidating, onSimulate }}>
            {props.children}
        </context.Provider>
    );
};
