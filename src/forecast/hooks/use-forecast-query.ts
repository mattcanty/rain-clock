import useSWR from 'swr';

import { usePosition } from '../../utils/use-position';
import { ForecastResponse } from '../model';

const FORECAST_FETCHER = (position: GeolocationPosition) =>
    fetch(
        `https://domsd7l1pe.execute-api.eu-west-2.amazonaws.com/Prod/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`,
    ).then(r => r.json());

/* every minute */
const REFRESH_INTERVAL = 1 * 1000 * 60;

export const useForecastQuery = () => {
    const [position] = usePosition();

    return useSWR<ForecastResponse>(position, FORECAST_FETCHER, { refreshInterval: REFRESH_INTERVAL });
};
