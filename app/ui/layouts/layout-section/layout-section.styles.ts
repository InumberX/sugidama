// Ported from develop: app/components/ui/layouts/LayoutSection/style.css.ts
import { getClampPx, type StyleRecipe } from '../../styles/public/mixins.ts'
import type { LayoutSectionSpace } from './layout-section.types.ts'

export const layoutSection: StyleRecipe = {
  inlineSize: '100%',
  marginBlock: 0,
  marginInline: 0,
  paddingInline: 0,
}

const SPACE: Record<LayoutSectionSpace, string | number> = {
  none: 0,
  small: getClampPx(24, 40),
  medium: getClampPx(40, 80),
}

/**
 * develop's `layoutSection__topSpace*` / `__bottomSpace*` modifiers, as lookups
 * so each value still has a name of its own.
 */
export const layoutSectionTopSpaces: Record<LayoutSectionSpace, StyleRecipe> = {
  none: { paddingBlockStart: SPACE.none },
  small: { paddingBlockStart: SPACE.small },
  medium: { paddingBlockStart: SPACE.medium },
}

export const layoutSectionBottomSpaces: Record<LayoutSectionSpace, StyleRecipe> = {
  none: { paddingBlockEnd: SPACE.none },
  small: { paddingBlockEnd: SPACE.small },
  medium: { paddingBlockEnd: SPACE.medium },
}
