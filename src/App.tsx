import React from 'react';
import { ThemeProvider } from 'styled-components';

import AnalogFace from './components/AnalogFace/AnalogFace';
import { ForecastProvider } from './components/ForecastProvider/ForecastProvider';
import RainClock from './components/RainClock/RainClock';
import WaterLevelFace from './components/WaterLevelFace/WaterLevelFace';
import LandingScreen from './screens/LandingScreen/LandingScreen';
import { light } from './theme/light';

export const App: React.FunctionComponent = () => {
    return (
        <ThemeProvider theme={light}>
            <ForecastProvider>
                <LandingScreen>
                    <RainClock>
                        <WaterLevelFace />
                        <AnalogFace margin={0.1} />
                    </RainClock>
                </LandingScreen>
            </ForecastProvider>
        </ThemeProvider>
    );
};
