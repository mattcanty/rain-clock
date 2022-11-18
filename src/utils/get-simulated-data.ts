import { ForecastResponse } from '../forecast/model';

export const getSimulatedData = (): ForecastResponse => {
    var now = Math.round(new Date().getTime() / 1000);
    return {
        summary: "This is a simulation.",
        data: [
            { time: now - 100, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 1, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 2, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 3, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 4, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 5, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 6, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 7, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 8, precipIntensity: 0.01, precipProbability: 1 },
            { time: now + 60 * 1000 * 9, precipIntensity: 0.02, precipProbability: 1 },
            { time: now + 60 * 1000 * 10, precipIntensity: 0.03, precipProbability: 1 },
            { time: now + 60 * 1000 * 11, precipIntensity: 0.04, precipProbability: 1 },
            { time: now + 60 * 1000 * 12, precipIntensity: 0.05, precipProbability: 1 },
            { time: now + 60 * 1000 * 13, precipIntensity: 0.04, precipProbability: 1 },
            { time: now + 60 * 1000 * 14, precipIntensity: 0.04, precipProbability: 1 },
            { time: now + 60 * 1000 * 15, precipIntensity: 0.04, precipProbability: 0.6 },
            { time: now + 60 * 1000 * 16, precipIntensity: 0.03, precipProbability: 0.5 },
            { time: now + 60 * 1000 * 17, precipIntensity: 0.01, precipProbability: 0.5 },
            { time: now + 60 * 1000 * 18, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 19, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 20, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 21, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 22, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 23, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 24, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 25, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 26, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 27, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 28, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 29, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 30, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 31, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 32, precipIntensity: 0.008, precipProbability: 0.2 },
            { time: now + 60 * 1000 * 33, precipIntensity: 0.008, precipProbability: 0.2 },
            { time: now + 60 * 1000 * 34, precipIntensity: 0.008, precipProbability: 0.2 },
            { time: now + 60 * 1000 * 35, precipIntensity: 0.008, precipProbability: 0.2 },
            { time: now + 60 * 1000 * 36, precipIntensity: 0.008, precipProbability: 0.2 },
            { time: now + 60 * 1000 * 37, precipIntensity: 0.008, precipProbability: 0.2 },
            { time: now + 60 * 1000 * 38, precipIntensity: 0.008, precipProbability: 0.2 },
            { time: now + 60 * 1000 * 39, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 40, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 41, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 42, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 43, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 44, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 45, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 46, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 47, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 48, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 49, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 50, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 51, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 52, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 53, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 54, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 55, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 56, precipIntensity: 0, precipProbability: 0 },
            { time: now + 60 * 1000 * 57, precipIntensity: 0.08, precipProbability: 0.2 },
            { time: now + 60 * 1000 * 58, precipIntensity: 0.25, precipProbability: 0.3 },
            { time: now + 60 * 1000 * 59, precipIntensity: 0.27, precipProbability: 0.3 },
        ]
    };
};
