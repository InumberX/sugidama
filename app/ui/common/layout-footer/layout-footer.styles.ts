// Ported from develop: app/components/common/LayoutFooter/style.css.ts
import { MEDIA_QUERY } from '../../styles/public/media-query.ts'
import type { StyleRecipe } from '../../styles/public/mixins.ts'
import { fontCaptionBold } from '../../styles/public/tokens.ts'

/** As wide as `LayoutMain`, pushed to the bottom of `LayoutWrapper`'s column. */
export const layoutFooter: StyleRecipe = {
  inlineSize: '100%',
  marginBlockStart: 'auto',
  marginInline: 'auto',
  maxInlineSize: 'calc(var(--layout-inner-max-width-large) + (var(--layout-main-gutter) * 2))',
  paddingInline: 'var(--layout-main-gutter)',
}

/** Below `sm` the bottom padding clears the global menu fixed over the screen's bottom edge. */
export const layoutFooter_wrapper: StyleRecipe = {
  backgroundColor: 'var(--color-util-black)',
  paddingBlockEnd: 'var(--layout-header-height)',
  [MEDIA_QUERY.SM]: { paddingBlockEnd: 'var(--layout-main-gutter)' },
}

export const layoutFooterCopy: StyleRecipe = {
  paddingBlock: '24px',
}

export const layoutFooterCopy_paragraph: StyleRecipe = {
  textAlign: 'center',
}

export const layoutFooterCopy_text: StyleRecipe = {
  ...fontCaptionBold,
  color: 'var(--color-font-light)',
}
