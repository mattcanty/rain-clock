import React from 'react';
import { ThemeProvider } from 'styled-components';

import AnalogFace from './components/AnalogFace/AnalogFace';
import { ForecastProvider } from './components/ForecastProvider/ForecastProvider';
import RainClock from './components/RainClock/RainClock';
import WaterLevelFace from './components/WaterLevelFace/WaterLevelFace';
import AboutScreen from './screens/AboutScreen/AboutScreen';
import LandingScreen from './screens/LandingScreen/LandingScreen';
import { light } from './theme/light';
import { useHashRoute } from './utils/use-hash-route';

export const App: React.FunctionComponent = () => {
    const route = useHashRoute();

    return (
        <ThemeProvider theme={light}>
            <ForecastProvider>
                {route === 'about' ? (
                    <AboutScreen />
                ) : (
                    <LandingScreen>
                        <RainClock>
                            <WaterLevelFace />
                            <AnalogFace margin={0.1} />
                        </RainClock>
                    </LandingScreen>
                )}
            </ForecastProvider>
        </ThemeProvider>
    );
};
