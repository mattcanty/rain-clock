import React, { memo } from 'react';

import { Grid, GridProps } from '../Grid/Grid';

export interface QuickActionsProps extends React.PropsWithChildren<GridProps> {
    
}

const QuickActions: React.FunctionComponent<QuickActionsProps> = props => {
    return (
        <Grid display="flex" gap="small" border="small" borderRadius="medium" p="small">
            {props.children}
        </Grid>
    );
};

export default memo(QuickActions);
