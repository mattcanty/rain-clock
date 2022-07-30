import React, { memo } from 'react';

type LandingScreenProps = React.PropsWithChildren<{}>;

const LandingScreen: React.FunctionComponent<LandingScreenProps> = props => {
    return <div style={{ flex: 1, display: 'flex' }}>{props.children}</div>;
};

export default memo(LandingScreen);
