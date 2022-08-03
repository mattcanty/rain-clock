import React, { memo } from 'react';

import { Icon, IconType } from '../../Icon/Icon';

export interface QuickActionProps extends React.HTMLProps<HTMLButtonElement> {
    type: `${IconType}`;
}

const QuickAction: React.FunctionComponent<QuickActionProps> = props => {
    const { type, ...button } = props;

    return (
        <button  {...button}>
            <Icon type={props.type} />
        </button>
    );
};

export default memo(QuickAction);
