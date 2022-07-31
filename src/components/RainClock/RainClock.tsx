import React, { memo } from 'react';

import styles from './rain-clock.module.scss';

type RainClockProps = React.HTMLAttributes<HTMLDivElement> & {};

const RainClock: React.FunctionComponent<RainClockProps> = props => {
    return (
        <div className={styles.container} {...props}>
            {props.children}
        </div>
    );
};

export default memo(RainClock);
