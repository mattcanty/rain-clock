import React, { memo, useState } from 'react';

import { useHashRoute } from '../../utils/use-hash-route';
import { useInstallPrompt } from '../../utils/use-install-prompt';
import styles from './header.module.scss';

const Header: React.FunctionComponent = () => {
    const route = useHashRoute();
    const isAbout = route === 'about';
    const [installMode, install] = useInstallPrompt();
    const [showIosHint, setShowIosHint] = useState(false);

    const onInstall = () => {
        if (installMode === 'prompt') install();
        else setShowIosHint(shown => !shown);
    };

    return (
        <header className={styles.header}>
            <h1>Rain Clock</h1>
            <div className={styles.actions}>
                {installMode && (
                    <button type="button" className={styles.install} onClick={onInstall}>
                        Install app
                    </button>
                )}
                <a href={isAbout ? '#' : '#about'}>{isAbout ? 'Back to clock' : 'About'}</a>
            </div>
            {installMode === 'ios' && showIosHint && (
                <p className={styles.hint} role="status">
                    Tap the Share button <span aria-hidden="true">(□↑)</span>, then <strong>Add to Home Screen</strong>.
                </p>
            )}
        </header>
    );
};

export default memo(Header);
