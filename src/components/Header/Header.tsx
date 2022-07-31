import React, { memo, useCallback } from 'react';

import { useSimulation } from '../ForecastProvider/ForecastProvider';
import styles from './header.module.scss';

const Header: React.FunctionComponent = () => {
    const onSimulate = useSimulation();

    const onOpenGitHub = useCallback(() => {
        window.open(process.env.GIT_HUB, '_blank', 'noopener,noreferrer');
    }, []);

    return (
        <header className={styles.header}>
            <h1>Rain Clock</h1>
            <div className={styles.actions}>
                <button onClick={onSimulate}>Simulate</button>
                <button onClick={onOpenGitHub}>GitHub</button>
            </div>
        </header>
    );
};

export default memo(Header);
