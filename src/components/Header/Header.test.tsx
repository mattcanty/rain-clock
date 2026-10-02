import { act, render, screen } from '@testing-library/react';
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

    it('hides the install link on a computer whose browser offers no way to install', () => {
        render(<Header />);

        expect(screen.queryByRole('link', { name: /install|home screen/i })).not.toBeInTheDocument();
    });

    it('links phones to the Add to Home Screen guide', () => {
        const userAgent = jest
            .spyOn(navigator, 'userAgent', 'get')
            .mockReturnValue('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Safari/604.1');

        render(<Header />);

        expect(screen.getByRole('link', { name: 'Add to Home Screen' })).toHaveAttribute('href', '#install');
        userAgent.mockRestore();
    });

    it('offers to install on a computer once the browser makes it possible', () => {
        render(<Header />);

        act(() => {
            window.dispatchEvent(new Event('beforeinstallprompt'));
        });

        expect(screen.getByRole('link', { name: 'Install app' })).toHaveAttribute('href', '#install');
    });
});
