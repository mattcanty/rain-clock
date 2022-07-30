import React from 'react';

import AnalogFace from './components/AnalogFace/AnalogFace';
import RainClock from './components/RainClock/RainClock';
import WaterLevelFace from './components/WaterLevelFace/WaterLevelFace';
import LandingScreen from './screens/LandingScreen/LandingScreen';

export const App: React.FunctionComponent = () => {
    return (
        <LandingScreen>
            <RainClock
                style={{ position: 'relative', display: 'flex', flex: 1, justifyContent: 'center', maxHeight: 600 }}>
                <WaterLevelFace />
                <AnalogFace margin={0.1} />
            </RainClock>
        </LandingScreen>
    );
};
