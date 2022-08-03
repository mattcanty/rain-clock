import styled from 'styled-components';
import * as system from 'styled-system';

import { Theme } from '../../theme/model';
import { SpacingToken } from '../../theme/tokens/spacing-tokens';

interface GapProps {
    gap?: `${SpacingToken}`;
}

const gap = system.system({
    gap: {
        property: 'gap',
        scale: 'space',
    },
});

export type GridProps = system.FlexboxProps<Theme> &
    system.SpaceProps<Theme> &
    system.PositionProps<Theme> &
    system.BackgroundProps<Theme> &
    system.LayoutProps<Theme> &
    system.BorderProps<Theme> &
    system.BackgroundColorProps<Theme> &
    GapProps;

export const Grid = styled.div<GridProps>`
    ${system.flexbox}
    ${system.space}
    ${system.position}
    ${system.backgroundColor}
    ${system.layout}
    ${system.border}
    ${system.color}
    ${gap}
`;
