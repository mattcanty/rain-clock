import React, { memo, useState } from 'react';

import Header from '../../components/Header/Header';
import { Platform, useInstallPrompt } from '../../utils/use-install-prompt';
import {
    AndroidAddToHomeScreen,
    AndroidConfirm,
    AndroidMenu,
    HomeScreen,
    IosAddToHomeScreen,
    IosConfirm,
    IosShare,
} from './illustrations';
import styles from './install-screen.module.scss';

interface Step {
    image?: React.ReactNode;
    text: React.ReactNode;
}

const platforms: { id: Platform; label: string }[] = [
    { id: 'ios', label: 'iPhone / iPad' },
    { id: 'android', label: 'Android' },
    { id: 'desktop', label: 'Computer' },
];

const steps: Record<Platform, Step[]> = {
    ios: [
        {
            image: <IosShare />,
            text: (
                <>
                    In Safari, tap the <strong>Share</strong> button. On iOS 26, tap <strong>•••</strong> first, then{' '}
                    <strong>Share</strong>.
                </>
            ),
        },
        {
            image: <IosAddToHomeScreen />,
            text: (
                <>
                    Scroll down and tap <strong>Add to Home Screen</strong>. If it's not there, tap{' '}
                    <strong>Edit Actions</strong> at the bottom to add it.
                </>
            ),
        },
        {
            image: <IosConfirm />,
            text: (
                <>
                    Leave <strong>Open as Web App</strong> on, then tap <strong>Add</strong>.
                </>
            ),
        },
        {
            image: <HomeScreen />,
            text: <>Rain Clock is now on your home screen, and opens full-screen like any other app.</>,
        },
    ],
    android: [
        {
            image: <AndroidMenu />,
            text: (
                <>
                    In Chrome, tap the <strong>⋮</strong> menu at the top right.
                </>
            ),
        },
        {
            image: <AndroidAddToHomeScreen />,
            text: (
                <>
                    Tap <strong>Add to Home screen</strong> (some phones call it <strong>Install app</strong>).
                </>
            ),
        },
        {
            image: <AndroidConfirm />,
            text: (
                <>
                    Tap <strong>Install</strong>. If you're asked, choose <strong>Install</strong> rather than{' '}
                    <strong>Create shortcut</strong>.
                </>
            ),
        },
        {
            image: <HomeScreen />,
            text: <>Rain Clock is now on your home screen, and opens full-screen like any other app.</>,
        },
    ],
    desktop: [
        {
            text: (
                <>
                    <strong>Chrome or Edge:</strong> click the install icon at the right-hand end of the address bar, or
                    open the browser menu and choose <strong>Install Rain Clock</strong>.
                </>
            ),
        },
        {
            text: (
                <>
                    <strong>Safari on a Mac:</strong> choose <strong>File › Add to Dock</strong>.
                </>
            ),
        },
    ],
};

const detectedLabel: Record<Platform, string> = {
    ios: 'iPhone or iPad',
    android: 'Android phone',
    desktop: 'computer',
};

const InstallScreen: React.FunctionComponent = () => {
    const [{ platform: detected, canPrompt, installed }, install] = useInstallPrompt();
    const [platform, setPlatform] = useState<Platform>(detected);

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <div className={styles.body}>
                    <h2>Add Rain Clock to your home screen</h2>
                    <p className={styles.lead}>
                        Get the clock one tap away. It opens full-screen like an app — no app store, nothing to
                        download.
                    </p>

                    {installed ? (
                        <p className={styles.done}>You're already using Rain Clock from your home screen.</p>
                    ) : (
                        <>
                            <div className={styles.tabs} role="tablist" aria-label="Device">
                                {platforms.map(({ id, label }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        role="tab"
                                        aria-selected={platform === id}
                                        className={styles.tab}
                                        onClick={() => setPlatform(id)}>
                                        {label}
                                        {id === detected && <span className={styles.badge}>This device</span>}
                                    </button>
                                ))}
                            </div>

                            {platform === detected && (
                                <p className={styles.detected}>
                                    Looks like you're on {platform === 'desktop' ? 'a' : 'an'} {detectedLabel[detected]}
                                    .
                                </p>
                            )}

                            {canPrompt && platform === detected && (
                                <div className={styles.quick}>
                                    <button type="button" className={styles.installButton} onClick={install}>
                                        Install Rain Clock
                                    </button>
                                    <span>One tap — or follow the steps below.</span>
                                </div>
                            )}

                            <ol className={styles.steps} role="tabpanel">
                                {steps[platform].map((step, index) => (
                                    <li key={index} className={step.image ? styles.step : styles.textStep}>
                                        {step.image && <div className={styles.image}>{step.image}</div>}
                                        <p>
                                            <span className={styles.number}>{index + 1}</span>
                                            <span>{step.text}</span>
                                        </p>
                                    </li>
                                ))}
                            </ol>

                            {platform === 'ios' && (
                                <p className={styles.note}>
                                    Using Chrome or another browser on your iPhone? The <strong>Share</strong> button is
                                    next to the address bar instead. If you can't find{' '}
                                    <strong>Add to Home Screen</strong>, open this page in Safari.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(InstallScreen);
