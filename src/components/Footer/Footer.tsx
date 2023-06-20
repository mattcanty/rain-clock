import React, { memo } from 'react';

import styles from './footer.module.scss';

const Footer: React.FunctionComponent = () => {
    return (
        <footer className={styles.footer}>
            <a href={process.env.GITHUB_REPO_URL} title="GitHub - weather-clock" target="_blank" rel="noopener">
                Created by Matt Canty
            </a>
            <a href={process.env.PIRATE_WEATHER_URL} title="Powered by Dark Sky" target="_blank" rel="noopener">
                Powered by Dark Sky
            </a>
        </footer>
    );
};

export default memo(Footer);
