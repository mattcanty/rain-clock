import React, { memo } from 'react';

import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import styles from './landing-screen.module.scss';

type LandingScreenProps = React.PropsWithChildren<{}>;

const LandingScreen: React.FunctionComponent<LandingScreenProps> = props => {
    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>{props.children}</div>
            <Footer />
        </div>
    );
};

export default memo(LandingScreen);
