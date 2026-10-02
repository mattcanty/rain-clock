import { useEffect, useState } from 'react';

// not in lib.dom yet - Chromium-only (Chrome, Edge, Samsung Internet, ...)
export interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/*
 *  'prompt' - the browser handed us its native install dialog to show on demand
 *  'ios'    - Safari on iOS/iPadOS: no install API, the user has to go via the Share sheet
 *  null     - already installed, or a browser with no way to install
 */
export type InstallMode = 'prompt' | 'ios' | null;

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

export const isIos = () =>
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPadOS reports itself as a Mac, but Macs don't have touch screens
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const currentMode = (): InstallMode => {
    if (isStandalone()) return null;
    if (deferred) return 'prompt';
    if (isIos()) return 'ios';
    return null;
};

export const useInstallPrompt = (): [InstallMode, () => Promise<void>] => {
    const [mode, setMode] = useState<InstallMode>(currentMode);

    useEffect(() => {
        const update = () => setMode(currentMode());
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

    return [mode, install];
};
