import React, { memo } from 'react';

import styles from './footer.module.scss';

const Footer: React.FunctionComponent = () => {
    return (
        <footer className={styles.footer}>
            Created by <a href={process.env.GITHUB_REPO_URL} title="GitHub - weather-clock" target="_blank" rel="noopener">
                Matt Canty
            </a> with UI ❤️ from Andrew Debens
            <a href={process.env.PIRATE_WEATHER_URL} title="Powered by Pirate Weather" target="_blank" rel="noopener">
                Powered by Pirate Weather
            </a>
        </footer>
    );
};

export default memo(Footer);
