// Ported from develop: app/components/ui/layouts/LayoutSection/style.css.ts
import { getClampPx, type StyleRecipe } from '../../styles/public/mixins.ts'
import type { LayoutSectionSpace } from './layout-section.types.ts'

export const layoutSection: StyleRecipe = {
  inlineSize: '100%',
  marginBlock: 0,
  marginInline: 0,
  paddingInline: 0,
}

const SPACE_SMALL = getClampPx(24, 40)
const SPACE_MEDIUM = getClampPx(40, 80)

export const layoutSection__topSpaceNone: StyleRecipe = { paddingBlockStart: 0 }
export const layoutSection__topSpaceSmall: StyleRecipe = { paddingBlockStart: SPACE_SMALL }
export const layoutSection__topSpaceMedium: StyleRecipe = { paddingBlockStart: SPACE_MEDIUM }

export const layoutSection__bottomSpaceNone: StyleRecipe = { paddingBlockEnd: 0 }
export const layoutSection__bottomSpaceSmall: StyleRecipe = { paddingBlockEnd: SPACE_SMALL }
export const layoutSection__bottomSpaceMedium: StyleRecipe = { paddingBlockEnd: SPACE_MEDIUM }

/** Lookups for the `topSpace` / `bottomSpace` props; members are the modifiers above. */
export const layoutSectionTopSpaces: Record<LayoutSectionSpace, StyleRecipe> = {
  none: layoutSection__topSpaceNone,
  small: layoutSection__topSpaceSmall,
  medium: layoutSection__topSpaceMedium,
}

export const layoutSectionBottomSpaces: Record<LayoutSectionSpace, StyleRecipe> = {
  none: layoutSection__bottomSpaceNone,
  small: layoutSection__bottomSpaceSmall,
  medium: layoutSection__bottomSpaceMedium,
}
