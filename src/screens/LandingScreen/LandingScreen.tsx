import React, { memo } from 'react';

import Header from '../../components/Header/Header';
import LocationBox from '../../components/LocationBox/LocationBox';
import styles from './landing-screen.module.scss';

type LandingScreenProps = React.PropsWithChildren<{}>;

const LandingScreen: React.FunctionComponent<LandingScreenProps> = props => {
    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                {props.children}
                <LocationBox />
            </div>
        </div>
    );
};

export default memo(LandingScreen);
