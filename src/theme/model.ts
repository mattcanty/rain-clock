import { BorderToken } from './tokens/border-tokens';
import { ColorToken } from './tokens/color-tokens';

import type { RadiiToken } from './tokens/radii-tokens';
import type { SpacingToken } from './tokens/spacing-tokens';

import type { Theme as BaseTheme } from 'styled-system';

export type SemanticColor = `${ColorToken}`;
export type SemanticRadii = `${RadiiToken}`;
export type SemanticSpacing = `${SpacingToken}`;

export interface Theme extends BaseTheme {
    borders: Record<`${BorderToken}`, string>;
    colors: Record<`${ColorToken}`, string>;
    radii: Record<`${RadiiToken}`, number>;
    space: Record<`${SpacingToken}`, number | string>;
}
