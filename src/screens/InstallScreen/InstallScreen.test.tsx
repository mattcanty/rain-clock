import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import InstallScreen from './InstallScreen';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Safari/604.1';
const ANDROID = 'Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/140.0 Mobile Safari/537.36';

const useUserAgent = (value: string) => jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(value);

describe('InstallScreen', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('shows the iPhone steps on an iPhone, marked as this device', () => {
        useUserAgent(IPHONE);

        render(<InstallScreen />);

        expect(screen.getByRole('tab', { name: /iPhone/ })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: /iPhone/ })).toHaveTextContent('This device');
        expect(screen.getByRole('img', { name: /share button/i })).toBeInTheDocument();
        expect(screen.getAllByText('Add to Home Screen', { selector: 'strong' }).length).toBeGreaterThan(0);
    });

    it('shows the Android steps on an Android phone', () => {
        useUserAgent(ANDROID);

        render(<InstallScreen />);

        expect(screen.getByRole('tab', { name: /Android/ })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('img', { name: /three-dot menu/i })).toBeInTheDocument();
    });

    it('lets you switch to another device', () => {
        useUserAgent(IPHONE);

        render(<InstallScreen />);
        fireEvent.click(screen.getByRole('tab', { name: /Android/ }));

        expect(screen.getByRole('img', { name: /three-dot menu/i })).toBeInTheDocument();
        expect(screen.queryByRole('img', { name: /share button/i })).not.toBeInTheDocument();
    });

    it('offers a one-tap install when the browser provides its own prompt', async () => {
        useUserAgent(ANDROID);
        render(<InstallScreen />);

        const prompt = jest.fn().mockResolvedValue(undefined);
        act(() => {
            window.dispatchEvent(
                Object.assign(new Event('beforeinstallprompt'), {
                    prompt,
                    userChoice: Promise.resolve({ outcome: 'accepted' }),
                }),
            );
        });

        fireEvent.click(screen.getByRole('button', { name: 'Install Rain Clock' }));

        expect(prompt).toHaveBeenCalled();
        await waitFor(() =>
            expect(screen.queryByRole('button', { name: 'Install Rain Clock' })).not.toBeInTheDocument(),
        );
    });
});
