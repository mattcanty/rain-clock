import React, { memo } from 'react';

import styles from './clock-face.module.scss';

export type ClockFaceProps = React.HTMLAttributes<HTMLDivElement>;

export const ClockFace = React.forwardRef<HTMLDivElement, ClockFaceProps>((props, ref) => {
    return (
        <div className={styles.container} ref={ref}>
            {props.children}
        </div>
    );
});

export default memo(ClockFace);
