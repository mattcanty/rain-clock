import { render, screen } from '@testing-library/react';
import React from 'react';

import AboutScreen from './AboutScreen';

describe('AboutScreen', () => {
    it('shows the site header', () => {
        render(<AboutScreen />);

        expect(screen.getByRole('heading', { name: 'Rain Clock' })).toBeInTheDocument();
    });

    it('links to Buy Me A Coffee', () => {
        render(<AboutScreen />);

        const link = screen.getByRole('link', { name: /buy me a coffee/i });
        expect(link).toHaveAttribute('href', process.env.BUY_ME_A_COFFEE_URL);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener');
    });

    it('credits the forecast data source', () => {
        render(<AboutScreen />);

        expect(screen.getByRole('link', { name: /openweather/i })).toBeInTheDocument();
    });
});
