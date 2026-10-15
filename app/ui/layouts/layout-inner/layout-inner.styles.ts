// Ported from develop: app/components/ui/layouts/LayoutInner/style.css.ts
import { MEDIA_QUERY } from '../../styles/public/media-query.ts'
import type { StyleRecipe } from '../../styles/public/mixins.ts'
import type { LayoutInnerSize } from './layout-inner.types.ts'

/** Widths and paddings are custom properties so `util` can retune the grid. */
export const layoutInner: StyleRecipe = {
  marginBlock: 0,
  marginInline: 'auto',
  paddingBlock: 0,
  paddingInline: 'var(--layout-inner-padding-xs)',
  inlineSize: '100%',
  [MEDIA_QUERY.SM]: { paddingInline: 'var(--layout-inner-padding-sm)' },
  [MEDIA_QUERY.MD]: { paddingInline: 'var(--layout-inner-padding-md)' },
}

/** The max width includes the horizontal padding, as in develop. */
export const layoutInner__large: StyleRecipe = {
  maxInlineSize: 'calc(var(--layout-inner-width-large) + (var(--layout-inner-padding-md) * 2))',
}
export const layoutInner__full: StyleRecipe = { maxInlineSize: 'none' }

/** Lookup for the `size` prop; members are the modifier recipes above. */
export const layoutInnerSizes: Record<LayoutInnerSize, StyleRecipe> = {
  large: layoutInner__large,
  full: layoutInner__full,
}
