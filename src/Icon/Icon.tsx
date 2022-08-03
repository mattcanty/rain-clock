import React from 'react';

/* https://fonts.google.com/icons */
import LocationOff from '../assets/svg/location-off.svg';
import LocationOn from '../assets/svg/location-on.svg';
import Refresh from '../assets/svg/refresh.svg';
import Science from '../assets/svg/science.svg';

export enum IconType {
    Science = 'science',
    Refresh = 'refresh',
    LocationOn = 'location-on',
    LocationOff = 'location-off',
}

const Icons: Record<IconType, React.ComponentType> = {
    [IconType.Science]: Science,
    [IconType.Refresh]: Refresh,
    [IconType.LocationOn]: LocationOn,
    [IconType.LocationOff]: LocationOff,
};

export interface IconProps {
    type: `${IconType}`;
}

export const Icon: React.FunctionComponent<IconProps> = props => {
    const Component = Icons[props.type];

    return <Component />;
};
