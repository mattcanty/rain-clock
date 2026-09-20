export type BarBounds = {
    upper: number;
    lower: number;
};

export const BAR_BOUNDS_STORAGE_KEY = 'rain-clock:forecast-bar-bounds';
export const BAR_BOUNDS_CHANGED_EVENT = 'rain-clock:forecast-bar-bounds-changed';
export const BAR_BOUNDS_FLAG_ROUTE = 'rain-bars';
export const DEFAULT_BAR_BOUNDS: BarBounds = { upper: 1, lower: 2 / 3 };

const MIN_GAP = 0.01;

const toFixed = (value: number) => Number(value.toFixed(2));

export const clampBarBounds = ({ upper, lower }: BarBounds): BarBounds => {
    const clampedUpper = Math.max(MIN_GAP, Math.min(1, upper));
    const clampedLower = Math.max(0, Math.min(clampedUpper - MIN_GAP, lower));

    return {
        upper: toFixed(clampedUpper),
        lower: toFixed(clampedLower),
    };
};

export const parseBarBounds = (value: unknown): BarBounds | undefined => {
    if (typeof value !== 'object' || !value) return undefined;

    const { upper, lower } = value as Partial<BarBounds>;
    if (typeof upper !== 'number' || typeof lower !== 'number') return undefined;

    return clampBarBounds({ upper, lower });
};

export const readStoredBarBounds = (): BarBounds => {
    try {
        const stored = localStorage.getItem(BAR_BOUNDS_STORAGE_KEY);
        const parsed = stored ? parseBarBounds(JSON.parse(stored)) : undefined;
        return parsed ?? DEFAULT_BAR_BOUNDS;
    } catch {
        return DEFAULT_BAR_BOUNDS;
    }
};

export const writeStoredBarBounds = (bounds: BarBounds) => {
    const clamped = clampBarBounds(bounds);
    try {
        localStorage.setItem(BAR_BOUNDS_STORAGE_KEY, JSON.stringify(clamped));
    } catch {
        // storage can be unavailable; keep the in-memory update path via the custom event
    }
    window.dispatchEvent(new Event(BAR_BOUNDS_CHANGED_EVENT));
};

export const isBarBoundsFeatureEnabled = (route: string) => route === BAR_BOUNDS_FLAG_ROUTE;
