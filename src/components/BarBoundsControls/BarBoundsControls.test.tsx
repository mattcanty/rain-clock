import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { BAR_BOUNDS_STORAGE_KEY, DEFAULT_RAIN_SETTINGS } from '../WaterLevelFace/bar-bounds';
import BarBoundsControls from './BarBoundsControls';

jest.mock('../../utils/use-hash-route', () => ({
    useHashRoute: jest.fn(),
}));

const { useHashRoute } = jest.requireMock('../../utils/use-hash-route') as { useHashRoute: jest.Mock };

describe('BarBoundsControls', () => {
    beforeEach(() => {
        localStorage.clear();
        useHashRoute.mockReturnValue('');
    });

    it('stays hidden unless the easter-egg route is active', () => {
        render(<BarBoundsControls />);

        expect(screen.queryByRole('group', { name: 'Rain bar bounds' })).not.toBeInTheDocument();
    });

    it('renders every control on the easter-egg route', () => {
        useHashRoute.mockReturnValue('rain-bars');
        render(<BarBoundsControls />);

        expect(screen.getByRole('group', { name: 'Rain bar bounds' })).toBeInTheDocument();
        expect(screen.getByRole('slider', { name: 'Upper rain bar bound' })).toBeInTheDocument();
        expect(screen.getByRole('slider', { name: 'Lower rain bar bound' })).toBeInTheDocument();

        expect(screen.getByRole('slider', { name: 'Light rain band threshold' })).toBeInTheDocument();
        expect(screen.getByRole('slider', { name: 'Moderate rain band threshold' })).toBeInTheDocument();
        expect(screen.getByRole('slider', { name: 'Heavy rain band threshold' })).toBeInTheDocument();

        expect(screen.getByLabelText('Light rain band colour')).toBeInTheDocument();
        expect(screen.getByLabelText('Moderate rain band colour')).toBeInTheDocument();
        expect(screen.getByLabelText('Heavy rain band colour')).toBeInTheDocument();
        expect(screen.getByLabelText('Extreme rain colour')).toBeInTheDocument();

        expect(screen.getByRole('slider', { name: 'Rain chance colour floor' })).toBeInTheDocument();
        expect(screen.getByRole('slider', { name: 'Rain chance colour ceiling' })).toBeInTheDocument();
    });

    it('initializes controls from stored settings when enabled', () => {
        localStorage.setItem(
            BAR_BOUNDS_STORAGE_KEY,
            JSON.stringify({ ...DEFAULT_RAIN_SETTINGS, upper: 0.82, lower: 0.71 }),
        );
        useHashRoute.mockReturnValue('rain-bars');

        render(<BarBoundsControls />);

        expect(screen.getByRole('slider', { name: 'Upper rain bar bound' })).toHaveValue('0.82');
        expect(screen.getByRole('slider', { name: 'Lower rain bar bound' })).toHaveValue('0.71');
    });

    it('clamps and persists bar bounds when sliders are changed', () => {
        useHashRoute.mockReturnValue('rain-bars');
        render(<BarBoundsControls />);

        fireEvent.change(screen.getByRole('slider', { name: 'Upper rain bar bound' }), { target: { value: '0.50' } });
        fireEvent.change(screen.getByRole('slider', { name: 'Lower rain bar bound' }), { target: { value: '0.90' } });

        expect(screen.getByRole('slider', { name: 'Lower rain bar bound' })).toHaveValue('0.49');
        const stored = JSON.parse(localStorage.getItem(BAR_BOUNDS_STORAGE_KEY) ?? '{}');
        expect(stored.upper).toBe(0.5);
        expect(stored.lower).toBe(0.49);
    });

    it('keeps band thresholds ascending and persists them in mm', () => {
        useHashRoute.mockReturnValue('rain-bars');
        render(<BarBoundsControls />);

        fireEvent.change(screen.getByRole('slider', { name: 'Moderate rain band threshold' }), {
            target: { value: '0.05' },
        });

        const stored = JSON.parse(localStorage.getItem(BAR_BOUNDS_STORAGE_KEY) ?? '{}');
        expect(stored.bands.moderate.threshold).toBeGreaterThan(stored.bands.light.threshold);
    });

    it('persists band colour changes', () => {
        useHashRoute.mockReturnValue('rain-bars');
        render(<BarBoundsControls />);

        fireEvent.change(screen.getByLabelText('Heavy rain band colour'), { target: { value: '#123456' } });

        const stored = JSON.parse(localStorage.getItem(BAR_BOUNDS_STORAGE_KEY) ?? '{}');
        expect(stored.bands.heavy.color).toBe('#123456');
    });

    it('keeps the probability ceiling at or above the floor', () => {
        useHashRoute.mockReturnValue('rain-bars');
        render(<BarBoundsControls />);

        fireEvent.change(screen.getByRole('slider', { name: 'Rain chance colour ceiling' }), {
            target: { value: '0.2' },
        });
        fireEvent.change(screen.getByRole('slider', { name: 'Rain chance colour floor' }), {
            target: { value: '0.9' },
        });

        const stored = JSON.parse(localStorage.getItem(BAR_BOUNDS_STORAGE_KEY) ?? '{}');
        expect(stored.probabilityCeiling).toBeGreaterThanOrEqual(stored.probabilityFloor);
    });
});
