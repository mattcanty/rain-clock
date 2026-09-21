import {
    BAR_BOUNDS_STORAGE_KEY,
    DEFAULT_RAIN_SETTINGS,
    RainSettings,
    clampRainSettings,
    isBarBoundsFeatureEnabled,
    parseRainSettings,
    readStoredRainSettings,
    writeStoredRainSettings,
} from './bar-bounds';

const buildSettings = (overrides: Partial<RainSettings> = {}): RainSettings => ({
    ...DEFAULT_RAIN_SETTINGS,
    ...overrides,
});

describe('rain display settings', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('uses defaults when there is no saved setting', () => {
        expect(readStoredRainSettings()).toEqual(DEFAULT_RAIN_SETTINGS);
    });

    it('clamps invalid upper/lower bounds into a safe range', () => {
        expect(clampRainSettings(buildSettings({ upper: 2, lower: 5 }))).toMatchObject({ upper: 1, lower: 0.99 });
        expect(clampRainSettings(buildSettings({ upper: -1, lower: -1 }))).toMatchObject({ upper: 0.01, lower: 0 });
    });

    it('keeps band thresholds ascending with a minimum gap', () => {
        const settings = buildSettings({
            bands: {
                light: { threshold: 2, color: '#111111' },
                moderate: { threshold: 1, color: '#222222' },
                heavy: { threshold: 0.5, color: '#333333' },
            },
        });

        const clamped = clampRainSettings(settings);

        expect(clamped.bands.light.threshold).toBeLessThan(clamped.bands.moderate.threshold);
        expect(clamped.bands.moderate.threshold).toBeLessThan(clamped.bands.heavy.threshold);
    });

    it('falls back to default colours for invalid hex values', () => {
        const settings = buildSettings({ extremeColor: 'not-a-colour' });

        expect(clampRainSettings(settings).extremeColor).toBe(DEFAULT_RAIN_SETTINGS.extremeColor);
    });

    it('keeps the probability ceiling at or above the floor', () => {
        const settings = buildSettings({ probabilityFloor: 0.9, probabilityCeiling: 0.1 });

        const clamped = clampRainSettings(settings);
        expect(clamped.probabilityCeiling).toBeGreaterThanOrEqual(clamped.probabilityFloor);
    });

    it('writes and re-reads settings from localStorage', () => {
        const settings = buildSettings({ upper: 0.85, lower: 0.7 });
        writeStoredRainSettings(settings);

        expect(localStorage.getItem(BAR_BOUNDS_STORAGE_KEY)).toBe(JSON.stringify(clampRainSettings(settings)));
        expect(readStoredRainSettings()).toEqual(clampRainSettings(settings));
    });

    it('ignores malformed stored JSON', () => {
        localStorage.setItem(BAR_BOUNDS_STORAGE_KEY, '{oops');

        expect(readStoredRainSettings()).toEqual(DEFAULT_RAIN_SETTINGS);
    });

    it('parses only well-formed settings and rejects malformed ones', () => {
        const settings = buildSettings();
        expect(parseRainSettings(settings)).toEqual(clampRainSettings(settings));
        expect(parseRainSettings({ upper: '0.8', lower: 0.5 })).toBeUndefined();
        expect(parseRainSettings({ ...settings, bands: undefined })).toBeUndefined();
    });

    it('only enables controls on the easter egg hash route', () => {
        expect(isBarBoundsFeatureEnabled('rain-bars')).toBe(true);
        expect(isBarBoundsFeatureEnabled('about')).toBe(false);
        expect(isBarBoundsFeatureEnabled('')).toBe(false);
    });
});
