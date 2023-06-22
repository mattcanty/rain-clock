import React, { memo } from 'react';

import styles from './footer.module.scss';

const Footer: React.FunctionComponent = () => {
    return (
        <footer className={styles.footer}>
            <p>
                Created by&nbsp;
                <a href={process.env.GITHUB_REPO_URL} title="GitHub - Rain Clock" rel="noopener">
                    Matt Canty
                </a>
                with UI ❤️ from&nbsp;
                <a href="https://github.com/Debens" title="GitHub - Andrew Debens" rel="noopener">
                    Andrew Debens
                </a>
            </p>
            <a href={process.env.PIRATE_WEATHER_URL} title="Powered by Pirate Weather" rel="noopener">
                Powered by Pirate Weather
            </a>
        </footer>
    );
};

export default memo(Footer);
