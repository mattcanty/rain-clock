import { useEffect, useState } from 'react';

// not in lib.dom yet - Chromium-only (Chrome, Edge, Samsung Internet, ...)
export interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export type Platform = 'ios' | 'android' | 'desktop';

/*
 * beforeinstallprompt can fire before React has mounted, so it's captured at module load and
 * handed to whichever component asks for it later
 */
let deferred: BeforeInstallPromptEvent | undefined;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(listener => listener());

if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        deferred = event as BeforeInstallPromptEvent;
        notify();
    });
    window.addEventListener('appinstalled', () => {
        deferred = undefined;
        notify();
    });
}

export const isStandalone = () =>
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;

export const detectPlatform = (): Platform => {
    const userAgent = navigator.userAgent;
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'ios';
    // iPadOS reports itself as a Mac, but Macs don't have touch screens
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return 'ios';
    if (/android/i.test(userAgent)) return 'android';
    return 'desktop';
};

export interface InstallState {
    platform: Platform;
    // the browser handed us its native install dialog to show on demand
    canPrompt: boolean;
    // already running from the home screen
    installed: boolean;
    // whether it's worth offering "Add to Home Screen" at all
    offerInstall: boolean;
}

const currentState = (): InstallState => {
    const platform = detectPlatform();
    const canPrompt = deferred !== undefined;
    const installed = isStandalone();
    return { platform, canPrompt, installed, offerInstall: !installed && (canPrompt || platform !== 'desktop') };
};

export const useInstallPrompt = (): [InstallState, () => Promise<void>] => {
    const [state, setState] = useState<InstallState>(currentState);

    useEffect(() => {
        const update = () => setState(currentState());
        listeners.add(update);
        update();
        return () => {
            listeners.delete(update);
        };
    }, []);

    const install = async () => {
        const event = deferred;
        if (!event) return;
        await event.prompt();
        await event.userChoice;
        // a prompt can only be shown once; if it was dismissed the browser fires a fresh
        // beforeinstallprompt later, which brings the button back
        deferred = undefined;
        notify();
    };

    return [state, install];
};
