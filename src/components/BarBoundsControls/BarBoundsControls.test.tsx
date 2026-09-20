import { render, screen } from '@testing-library/react';
import React from 'react';

import { BAR_BOUNDS_STORAGE_KEY } from '../WaterLevelFace/bar-bounds';
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

    it('renders on the easter-egg route', () => {
        useHashRoute.mockReturnValue('rain-bars');
        render(<BarBoundsControls />);

        expect(screen.getByRole('group', { name: 'Rain bar bounds' })).toBeInTheDocument();
        expect(screen.getByRole('slider', { name: 'Upper rain bar bound' })).toBeInTheDocument();
        expect(screen.getByRole('slider', { name: 'Lower rain bar bound' })).toBeInTheDocument();
    });

    it('initializes sliders from stored bounds when enabled', () => {
        localStorage.setItem(BAR_BOUNDS_STORAGE_KEY, JSON.stringify({ upper: 0.82, lower: 0.71 }));
        useHashRoute.mockReturnValue('rain-bars');

        render(<BarBoundsControls />);

        expect(screen.getByRole('slider', { name: 'Upper rain bar bound' })).toHaveValue('0.82');
        expect(screen.getByRole('slider', { name: 'Lower rain bar bound' })).toHaveValue('0.71');
    });
});
