import { Coordinates } from '../utils/use-position';

export interface ForecastSlice {
    time: number;
    precipIntensity: number;
    precipProbability: number;
}

export type ForecastData = ForecastSlice[];

export interface Forecast {
    data: ForecastData;
    loading: boolean;
    isAutoRefreshing: boolean;
    resumeAutoRefresh: () => void;
    refreshNow: () => void;
    position: Coordinates | undefined;
    setCoordinates: (coordinates: Coordinates) => void;
    clearOverride: () => void;
    isOverridden: boolean;
    requestPosition: () => void;
    locationError: string | undefined;
}
