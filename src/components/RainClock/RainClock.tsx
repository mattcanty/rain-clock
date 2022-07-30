import React, { memo } from 'react';

type RainClockProps = React.HTMLAttributes<HTMLDivElement> & {};

const RainClock: React.FunctionComponent<RainClockProps> = props => {
    return (
        <div className="rain-clock" {...props}>
            {props.children}
        </div>
    );
};

export default memo(RainClock);
