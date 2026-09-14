import { render, screen } from '@testing-library/react';
import React from 'react';

import Header from './Header';

describe('Header', () => {
    afterEach(() => {
        window.location.hash = '';
    });

    it('shows the site title', () => {
        render(<Header />);

        expect(screen.getByRole('heading', { name: 'Rain Clock' })).toBeInTheDocument();
    });

    it('links to the About page from the clock screen', () => {
        render(<Header />);

        const link = screen.getByRole('link', { name: 'About' });
        expect(link).toHaveAttribute('href', '#about');
    });

    it('links back to the clock from the About page', () => {
        window.location.hash = '#about';

        render(<Header />);

        const link = screen.getByRole('link', { name: 'Back to clock' });
        expect(link).toHaveAttribute('href', '#');
    });
});
