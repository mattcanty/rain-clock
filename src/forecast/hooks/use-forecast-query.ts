import useSWR from 'swr';

import { usePosition } from '../../utils/use-position';
import { ForecastData } from '../model';

const FORECAST_FETCHER = (position: GeolocationPosition) =>
    fetch(
        `${process.env.WEATHER_API_URL}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`,
    ).then(r => r.json());

/* every minute */
const REFRESH_INTERVAL = 1 * 1000 * 60;

export const useForecastQuery = () => {
    const [position] = usePosition();

    return useSWR<ForecastData>(position, FORECAST_FETCHER, { refreshInterval: REFRESH_INTERVAL });
};
