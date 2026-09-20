import {
    BAR_BOUNDS_STORAGE_KEY,
    DEFAULT_BAR_BOUNDS,
    clampBarBounds,
    isBarBoundsFeatureEnabled,
    parseBarBounds,
    readStoredBarBounds,
    writeStoredBarBounds,
} from './bar-bounds';

describe('bar bounds settings', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('uses defaults when there is no saved setting', () => {
        expect(readStoredBarBounds()).toEqual(DEFAULT_BAR_BOUNDS);
    });

    it('clamps invalid values into a safe range', () => {
        expect(clampBarBounds({ upper: 2, lower: 5 })).toEqual({ upper: 1, lower: 0.99 });
        expect(clampBarBounds({ upper: -1, lower: -1 })).toEqual({ upper: 0.01, lower: 0 });
    });

    it('writes and re-reads bounds from localStorage', () => {
        writeStoredBarBounds({ upper: 0.85, lower: 0.7 });

        expect(localStorage.getItem(BAR_BOUNDS_STORAGE_KEY)).toBe(JSON.stringify({ upper: 0.85, lower: 0.7 }));
        expect(readStoredBarBounds()).toEqual({ upper: 0.85, lower: 0.7 });
    });

    it('ignores malformed stored JSON', () => {
        localStorage.setItem(BAR_BOUNDS_STORAGE_KEY, '{oops');

        expect(readStoredBarBounds()).toEqual(DEFAULT_BAR_BOUNDS);
    });

    it('parses only numeric bounds and rejects malformed settings', () => {
        expect(parseBarBounds({ upper: 0.8, lower: 0.5 })).toEqual({ upper: 0.8, lower: 0.5 });
        expect(parseBarBounds({ upper: '0.8', lower: 0.5 })).toBeUndefined();
    });

    it('only enables controls on the easter egg hash route', () => {
        expect(isBarBoundsFeatureEnabled('rain-bars')).toBe(true);
        expect(isBarBoundsFeatureEnabled('about')).toBe(false);
        expect(isBarBoundsFeatureEnabled('')).toBe(false);
    });
});
