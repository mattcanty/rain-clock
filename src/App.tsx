import React from 'react';

import AnalogFace from './components/AnalogFace/AnalogFace';
import { ForecastProvider } from './components/ForecastProvider/ForecastProvider';
import RainClock from './components/RainClock/RainClock';
import WaterLevelFace from './components/WaterLevelFace/WaterLevelFace';
import LandingScreen from './screens/LandingScreen/LandingScreen';

export const App: React.FunctionComponent = () => {
    return (
        <ForecastProvider>
            <LandingScreen>
                <RainClock>
                    <WaterLevelFace />
                    <AnalogFace margin={0.1} />
                </RainClock>
            </LandingScreen>
        </ForecastProvider>
    );
};
