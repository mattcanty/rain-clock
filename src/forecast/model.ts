export interface ForecastSlice {
    time: number;
    precipIntensity: number;
    precipProbability: number;
}

export type ForecastResponse = {
    summary: string;
    data: ForecastSlice[];
}

export interface Forecast {
    response: ForecastResponse;
    loading: boolean;
    onSimulate: () => void;
}
