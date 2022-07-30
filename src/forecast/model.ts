export interface ForecastSlice {
    time: number;
    precipIntensity: number;
    precipProbability: number;
}

export interface Forecast {
    data: ForecastSlice[];
}
