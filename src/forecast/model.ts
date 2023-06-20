export interface ForecastSlice {
    time: number;
    precipIntensity: number;
    precipProbability: number;
}

export type ForecastData = ForecastSlice[];

export interface Forecast {
    data: ForecastData;
    loading: boolean;
    onSimulate: () => void;
}
