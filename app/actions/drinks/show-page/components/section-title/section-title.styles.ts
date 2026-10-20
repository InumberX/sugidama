// Ported from develop: app/components/ui/typographies/SectionTitle/style.css.ts
import type { StyleRecipe } from '../../../../../ui/styles/public/mixins.ts'
import { fontHeading2 } from '../../../../../ui/styles/public/tokens.ts'

export const sectionTitle: StyleRecipe = {
  paddingInlineStart: '22px',
  position: 'relative',
}

/** The gradient bar before the text. */
export const sectionTitle_divider: StyleRecipe = {
  background: 'linear-gradient(180deg, var(--color-gradation-primary))',
  blockSize: '100%',
  inlineSize: '6px',
  insetBlockStart: 0,
  insetInlineStart: 0,
  position: 'absolute',
}

export const sectionTitle_text: StyleRecipe = {
  ...fontHeading2,
  color: 'var(--color-font-sub-dark)',
}
