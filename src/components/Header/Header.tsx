import React, { memo } from 'react';

import { useHashRoute } from '../../utils/use-hash-route';
import { useInstallPrompt } from '../../utils/use-install-prompt';
import styles from './header.module.scss';

const Header: React.FunctionComponent = () => {
    const route = useHashRoute();
    const onClock = route !== 'about' && route !== 'install';
    const [{ platform, offerInstall }] = useInstallPrompt();

    return (
        <header className={styles.header}>
            <h1>Rain Clock</h1>
            <div className={styles.actions}>
                {offerInstall && route !== 'install' && (
                    <a className={styles.install} href="#install">
                        {platform === 'desktop' ? 'Install app' : 'Add to Home Screen'}
                    </a>
                )}
                <a href={onClock ? '#about' : '#'}>{onClock ? 'About' : 'Back to clock'}</a>
            </div>
        </header>
    );
};

export default memo(Header);
