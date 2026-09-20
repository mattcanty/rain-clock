import React, { memo } from 'react';

import BarBoundsControls from '../../components/BarBoundsControls/BarBoundsControls';
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
                <BarBoundsControls />
            </div>
        </div>
    );
};

export default memo(LandingScreen);
