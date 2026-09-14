import React, { memo } from 'react';

import { useHashRoute } from '../../utils/use-hash-route';
import styles from './header.module.scss';

const Header: React.FunctionComponent = () => {
    const route = useHashRoute();
    const isAbout = route === 'about';

    return (
        <header className={styles.header}>
            <h1>Rain Clock</h1>
            <div className={styles.actions}>
                <a href={isAbout ? '#' : '#about'}>{isAbout ? 'Back to clock' : 'About'}</a>
            </div>
        </header>
    );
};

export default memo(Header);
