// Ported from develop: app/components/ui/layouts/LayoutPageWrapper/style.css.ts
import type { StyleRecipe } from '../../styles/public/mixins.ts'

/**
 * develop padded both ends by the header height plus 16px
 * (`getClampPx(64 + 16, 64 + 16)`, a fixed 80px). The height is a custom
 * property so the header and this offset cannot disagree.
 */
const headerOffset = 'calc(var(--layout-header-height) + 16px)'

// Longhands, not the `padding-block` shorthand: a later spread replaces the
// key outright, so an override leaves no dead value behind in the output.
export const layoutPageWrapper: StyleRecipe = {
  backgroundColor: 'var(--color-background-light)',
  paddingBlockEnd: headerOffset,
  paddingBlockStart: headerOffset,
}

/**
 * develop expressed these as class-combination selectors
 * (`&${layoutPageWrapper__topNoSpace}`). Here they are recipes spread after the
 * base, so the override is decided by JS spread order rather than by selector
 * weight.
 */
export const layoutPageWrapper__topNoSpace: StyleRecipe = { paddingBlockStart: 0 }

export const layoutPageWrapper__bottomNoSpace: StyleRecipe = { paddingBlockEnd: 0 }
