import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

    it('hides the install button when the browser offers no way to install', () => {
        render(<Header />);

        expect(screen.queryByRole('button', { name: 'Install app' })).not.toBeInTheDocument();
    });

    it("shows the browser's install prompt once one is offered", async () => {
        render(<Header />);

        const prompt = jest.fn().mockResolvedValue(undefined);
        const event = Object.assign(new Event('beforeinstallprompt'), {
            prompt,
            userChoice: Promise.resolve({ outcome: 'accepted' }),
        });
        act(() => {
            window.dispatchEvent(event);
        });

        fireEvent.click(screen.getByRole('button', { name: 'Install app' }));

        expect(prompt).toHaveBeenCalled();
        await waitFor(() => expect(screen.queryByRole('button', { name: 'Install app' })).not.toBeInTheDocument());
    });

    it('explains Add to Home Screen on iOS, where there is no install prompt', () => {
        const userAgent = jest
            .spyOn(navigator, 'userAgent', 'get')
            .mockReturnValue('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Safari/604.1');

        render(<Header />);
        fireEvent.click(screen.getByRole('button', { name: 'Install app' }));

        expect(screen.getByRole('status')).toHaveTextContent('Add to Home Screen');
        userAgent.mockRestore();
    });
});
