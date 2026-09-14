import React, { memo } from 'react';

import Header from '../../components/Header/Header';
import styles from './about-screen.module.scss';

const AboutScreen: React.FunctionComponent = () => {
    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <div className={styles.body}>
                    <p>
                        Rain Clock puts a hyper-local rain forecast on a clock face, so you can tell whether it's
                        about to rain in the next hour from a single glance — no app to open, no numbers to read.
                    </p>
                    <p>
                        It started life in September 2014, as a small personal project. It was my idea to put the
                        upcoming hour's rain on a clock face. Many of my friends use it and I'm proud to still
                        be supporting it here in 2026!
                    </p>
                    <p>
                        I don't want anything for it. But I do drink coffee and it's an easy way to support this
                        helpful little thing.
                    </p>
                    <a
                        className={styles.coffee}
                        href={process.env.BUY_ME_A_COFFEE_URL}
                        target="_blank"
                        rel="noopener"
                    >
                        ☕ Buy me a coffee
                    </a>
                    <div className={styles.credits}>
                        <span>
                            Forecast data powered by{' '}
                            <a href="https://openweathermap.org/" target="_blank" rel="noopener">
                                OpenWeather
                            </a>
                            .
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(AboutScreen);
