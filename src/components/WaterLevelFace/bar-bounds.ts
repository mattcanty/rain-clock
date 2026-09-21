export type BarBounds = {
    upper: number;
    lower: number;
};

export type RainBandKey = 'light' | 'moderate' | 'heavy';

export type RainBand = {
    /** upper edge of this band, in mm/h of precipitation intensity */
    threshold: number;
    /** this band's colour at 100% forecast probability, as a 6-digit CSS hex colour */
    color: string;
};

export type RainBands = Record<RainBandKey, RainBand>;

export type RainSettings = BarBounds & {
    bands: RainBands;
    /** colour used for readings heavier than the "heavy" band's threshold */
    extremeColor: string;
    /** colour saturation floor/ceiling applied across 0%-100% forecast probability */
    probabilityFloor: number;
    probabilityCeiling: number;
};

export const BAR_BOUNDS_STORAGE_KEY = 'rain-clock:rain-display-settings';
export const BAR_BOUNDS_CHANGED_EVENT = 'rain-clock:rain-display-settings-changed';
export const BAR_BOUNDS_FLAG_ROUTE = 'rain-bars';

export const DEFAULT_RAIN_BANDS: RainBands = {
    light: { threshold: 0.1, color: '#c6dbef' },
    moderate: { threshold: 0.4, color: '#4292c6' },
    heavy: { threshold: 1, color: '#08306b' },
};

export const DEFAULT_RAIN_SETTINGS: RainSettings = {
    upper: 1,
    lower: 2 / 3,
    bands: DEFAULT_RAIN_BANDS,
    extremeColor: '#a50f15',
    probabilityFloor: 0.15,
    probabilityCeiling: 0.85,
};

/* kept for the pre-existing radius-only API (createIntensityScale's default bounds, tests, etc.) */
export const DEFAULT_BAR_BOUNDS: BarBounds = { upper: DEFAULT_RAIN_SETTINGS.upper, lower: DEFAULT_RAIN_SETTINGS.lower };

const MIN_GAP = 0.01;
const MIN_THRESHOLD = 0.01;
const MAX_THRESHOLD = 5;
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

const toFixed = (value: number) => Number(value.toFixed(2));
const clampUnit = (value: number) => Math.max(0, Math.min(1, value));
const clampThreshold = (value: number) => toFixed(Math.max(MIN_THRESHOLD, Math.min(MAX_THRESHOLD, value)));
const isValidColor = (value: unknown): value is string => typeof value === 'string' && HEX_COLOR.test(value);
const orDefaultColor = (value: unknown, fallback: string) => (isValidColor(value) ? value : fallback);

export const clampBarBounds = ({ upper, lower }: BarBounds): BarBounds => {
    const clampedUpper = Math.max(MIN_GAP, Math.min(1, upper));
    const clampedLower = Math.max(0, Math.min(clampedUpper - MIN_GAP, lower));

    return {
        upper: toFixed(clampedUpper),
        lower: toFixed(clampedLower),
    };
};

/* keeps the three band thresholds in ascending order, each at least MIN_GAP apart, so "light"
   always covers the lightest rain and "heavy" always borders the extreme-reading cutoff */
export const clampRainBands = (bands: RainBands): RainBands => {
    const light = clampThreshold(bands.light.threshold);
    const moderate = Math.max(light + MIN_GAP, clampThreshold(bands.moderate.threshold));
    const heavy = Math.max(moderate + MIN_GAP, clampThreshold(bands.heavy.threshold));

    return {
        light: { threshold: light, color: orDefaultColor(bands.light.color, DEFAULT_RAIN_BANDS.light.color) },
        moderate: { threshold: moderate, color: orDefaultColor(bands.moderate.color, DEFAULT_RAIN_BANDS.moderate.color) },
        heavy: { threshold: heavy, color: orDefaultColor(bands.heavy.color, DEFAULT_RAIN_BANDS.heavy.color) },
    };
};

export const clampRainSettings = (settings: RainSettings): RainSettings => {
    const floor = clampUnit(settings.probabilityFloor);

    return {
        ...clampBarBounds(settings),
        bands: clampRainBands(settings.bands),
        extremeColor: orDefaultColor(settings.extremeColor, DEFAULT_RAIN_SETTINGS.extremeColor),
        probabilityFloor: toFixed(floor),
        probabilityCeiling: toFixed(Math.max(floor, clampUnit(settings.probabilityCeiling))),
    };
};

const parseRainBand = (value: unknown): RainBand | undefined => {
    if (typeof value !== 'object' || !value) return undefined;
    const { threshold, color } = value as Partial<RainBand>;
    if (typeof threshold !== 'number' || typeof color !== 'string') return undefined;
    return { threshold, color };
};

export const parseRainSettings = (value: unknown): RainSettings | undefined => {
    if (typeof value !== 'object' || !value) return undefined;

    const { upper, lower, bands, extremeColor, probabilityFloor, probabilityCeiling } = value as Partial<RainSettings>;
    if (typeof upper !== 'number' || typeof lower !== 'number') return undefined;
    if (typeof extremeColor !== 'string') return undefined;
    if (typeof probabilityFloor !== 'number' || typeof probabilityCeiling !== 'number') return undefined;
    if (typeof bands !== 'object' || !bands) return undefined;

    const light = parseRainBand((bands as Partial<RainBands>).light);
    const moderate = parseRainBand((bands as Partial<RainBands>).moderate);
    const heavy = parseRainBand((bands as Partial<RainBands>).heavy);
    if (!light || !moderate || !heavy) return undefined;

    return clampRainSettings({ upper, lower, bands: { light, moderate, heavy }, extremeColor, probabilityFloor, probabilityCeiling });
};

export const readStoredRainSettings = (): RainSettings => {
    try {
        const stored = localStorage.getItem(BAR_BOUNDS_STORAGE_KEY);
        const parsed = stored ? parseRainSettings(JSON.parse(stored)) : undefined;
        return parsed ?? DEFAULT_RAIN_SETTINGS;
    } catch {
        return DEFAULT_RAIN_SETTINGS;
    }
};

export const writeStoredRainSettings = (settings: RainSettings) => {
    const clamped = clampRainSettings(settings);
    try {
        localStorage.setItem(BAR_BOUNDS_STORAGE_KEY, JSON.stringify(clamped));
    } catch {
        // storage can be unavailable; keep the in-memory update path via the custom event
    }
    if (typeof window !== 'undefined') window.dispatchEvent(new Event(BAR_BOUNDS_CHANGED_EVENT));
};

export const isBarBoundsFeatureEnabled = (route: string) => route === BAR_BOUNDS_FLAG_ROUTE;
