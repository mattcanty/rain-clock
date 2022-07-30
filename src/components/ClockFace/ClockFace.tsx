import React, { memo } from 'react';

export type ClockFaceProps = React.HTMLAttributes<HTMLDivElement>;

export const ClockFace = React.forwardRef<HTMLDivElement, ClockFaceProps>((props, ref) => {
    return (
        <div ref={ref} style={{ position: 'absolute', inset: 0 }}>
            {props.children}
        </div>
    );
});

export default memo(ClockFace);
