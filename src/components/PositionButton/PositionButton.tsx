import React, { memo } from 'react';

import { usePosition } from '../../utils/use-position';
import QuickAction from '../QuickAction/QuickAction';

export const PositionButton: React.FunctionComponent = () => {
    const [position, { fetch }] = usePosition();

    return <QuickAction type={position ? "location-on" : 'location-off'} onClick={fetch}/>
}

export default memo(PositionButton)