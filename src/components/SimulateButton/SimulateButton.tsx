import React, { memo } from 'react';

import { useSimulation } from '../ForecastProvider/ForecastProvider';
import QuickAction from '../QuickAction/QuickAction';

export const SimulateButton: React.FunctionComponent = () => {
    const onSimulate = useSimulation();

    return <QuickAction type="science" onClick={onSimulate} />
}

export default memo(SimulateButton)