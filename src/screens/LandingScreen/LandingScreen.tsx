import React, { memo } from 'react';

import Footer from '../../components/Footer/Footer';
import { Grid } from '../../components/Grid/Grid';
import Header from '../../components/Header/Header';
import PositionButton from '../../components/PositionButton/PositionButton';
import QuickActions from '../../components/QuickActions/QuickActions';
import SimulateButton from '../../components/SimulateButton/SimulateButton';
import styles from './landing-screen.module.scss';

type LandingScreenProps = React.PropsWithChildren<{}>;

const LandingScreen: React.FunctionComponent<LandingScreenProps> = props => {

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                {props.children}
                <Grid display="flex" justifyContent="center">
                    <QuickActions m="small">
                        <PositionButton />
                        <SimulateButton />
                    </QuickActions>
                </Grid>
            </div>
            <Footer />
        </div>
    );
};

export default memo(LandingScreen);
