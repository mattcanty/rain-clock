import useSWR from 'swr';

import { usePosition } from '../../utils/use-position';
import { ForecastSlice } from '../model';

const FORECAST_FETCHER = (position: GeolocationPosition) =>
    fetch(
        `${process.env.WEATHER_API}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`,
    ).then(r => r.json());

/* every minute */
const REFRESH_INTERVAL = 1 * 1000 * 60;

export const useForecastQuery = () => {
    const [position] = usePosition();

    return useSWR<ForecastSlice[]>(position, FORECAST_FETCHER, { refreshInterval: REFRESH_INTERVAL });
};
