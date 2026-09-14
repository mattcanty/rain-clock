import useSWR from 'swr';
import { useCallback, useEffect, useState } from 'react';

import { Coordinates } from '../../utils/use-position';
import { ForecastData } from '../model';

/* proxied through our own Netlify function rather than called directly: the weather
   provider doesn't send CORS headers for browser requests, and this also keeps the
   API key server-side instead of shipping it in the client bundle */
const FORECAST_FETCHER = async ([, lat, lon]: readonly [string, string, string]): Promise<ForecastData> => {
    const response = await fetch(`/.netlify/functions/get-minute-forecast?lat=${lat}&lon=${lon}`);
    const body = await response.json();

    // a failed upstream call still comes back as JSON (an { error } body), just with a
    // non-2xx status — treat that as a fetch failure rather than passing it off as data,
    // since downstream code assumes an array and doesn't gracefully iterate anything else
    if (!response.ok || !Array.isArray(body)) {
        throw new Error(`forecast request failed (${response.status}): ${!response.ok ? body?.error : 'unexpected response shape'}`);
    }

    return body;
};

/* every minute */
const REFRESH_INTERVAL = 1 * 1000 * 60;

/* stop auto-refreshing after this long; the user has to ask for more */
const AUTO_REFRESH_WINDOW = 5 * 1000 * 60;

/* ~110m precision: ignores GPS jitter so the SWR key only changes when location meaningfully changes */
const COORD_PRECISION = 3;

export const useForecastQuery = (position: Coordinates | undefined) => {
    const [autoRefreshUntil, setAutoRefreshUntil] = useState(() => Date.now() + AUTO_REFRESH_WINDOW);
    const [isAutoRefreshing, setIsAutoRefreshing] = useState(true);

    useEffect(() => {
        const remaining = autoRefreshUntil - Date.now();
        if (remaining <= 0) {
            setIsAutoRefreshing(false);
            return;
        }

        setIsAutoRefreshing(true);
        const timeout = setTimeout(() => setIsAutoRefreshing(false), remaining);
        return () => clearTimeout(timeout);
    }, [autoRefreshUntil]);

    const key = position
        ? (['forecast', position.latitude.toFixed(COORD_PRECISION), position.longitude.toFixed(COORD_PRECISION)] as const)
        : null;

    const { mutate, ...swr } = useSWR<ForecastData>(key, FORECAST_FETCHER, {
        refreshInterval: isAutoRefreshing ? REFRESH_INTERVAL : 0,
        /* never poll or revalidate while the tab is in the background; only once it's visible again */
        refreshWhenHidden: false,
        revalidateOnFocus: isAutoRefreshing,
        revalidateOnReconnect: isAutoRefreshing,
    });

    /* restarts the auto-refresh window; does not itself force a fetch, since a location change
       already triggers one via the SWR key changing — callers force one explicitly when needed */
    const resumeAutoRefresh = useCallback(() => {
        setAutoRefreshUntil(Date.now() + AUTO_REFRESH_WINDOW);
    }, []);

    return { ...swr, mutate, isAutoRefreshing, resumeAutoRefresh };
};
