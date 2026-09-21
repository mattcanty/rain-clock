import { createIntensityScale, INTENSITY_FLOOR } from './WaterLevelFace';
import { DEFAULT_BAR_BOUNDS } from './bar-bounds';

describe('createIntensityScale', () => {
    it('maps "no rain" (and anything at or below the floor) to the outer rim', () => {
        const scale = createIntensityScale(1);

        expect(scale(0)).toBe(DEFAULT_BAR_BOUNDS.upper);
        expect(scale(INTENSITY_FLOOR)).toBe(DEFAULT_BAR_BOUNDS.upper);
    });

    it('maps the heaviest reading in the current forecast to the centre', () => {
        const max = 5;
        const scale = createIntensityScale(max);

        expect(scale(max)).toBeCloseTo(DEFAULT_BAR_BOUNDS.lower);
    });

    it('never goes past the rim or the centre for out-of-range input', () => {
        const scale = createIntensityScale(1);

        expect(scale(-1)).toBeLessThanOrEqual(DEFAULT_BAR_BOUNDS.upper);
        expect(scale(1000)).toBeGreaterThanOrEqual(DEFAULT_BAR_BOUNDS.lower);
    });

    it('moves by equal amounts for equal order-of-magnitude jumps in intensity', () => {
        // a wide domain, as it would be after one freak heavy reading
        const scale = createIntensityScale(100);

        const stepAt = (value: number) => scale(value) - scale(value * 10);

        // 0.1 -> 1, 1 -> 10, 10 -> 100: each decade should move the same distance
        expect(stepAt(0.1)).toBeCloseTo(stepAt(1), 5);
        expect(stepAt(1)).toBeCloseTo(stepAt(10), 5);
    });

    it("doesn't let one extreme reading flatten an otherwise-typical forecast", () => {
        // a single freak spike, alongside the kind of values real forecasts mostly produce
        const spike = 50;
        const typicalHeavyRain = 1;
        const scale = createIntensityScale(spike);

        // under the old linear scale this would sit at radius 0.98 — practically invisible
        expect(scale(typicalHeavyRain)).toBeGreaterThan(0.3);
        expect(scale(typicalHeavyRain)).toBeLessThan(1);
    });
});
