// Ported from develop: app/components/ui/typographies/PageTitle/style.css.ts
import { getTextGradation } from '../../styles/public/color.ts'
import { getClampPx, type StyleRecipe } from '../../styles/public/mixins.ts'
import { fontHeading1 } from '../../styles/public/tokens.ts'
import type { PageTitleColor } from './page-title.types.ts'

/** Slot: the outer element. */
export const pageTitle: StyleRecipe = {}

export const pageTitle_wrapper: StyleRecipe = {
  paddingBlock: getClampPx(24, 40),
}

export const pageTitle_paragraph: StyleRecipe = {
  ...fontHeading1,
  color: 'var(--color-font-base)',
  display: 'flex',
}

export const pageTitle_text: StyleRecipe = {
  display: 'block',
}

/** Empty: the dark title is `pageTitle_paragraph`'s base color. Kept as the named slot. */
export const pageTitle_text__dark: StyleRecipe = {}

export const pageTitle_text__primary: StyleRecipe = {
  ...getTextGradation('linear-gradient(90deg, var(--color-gradation-primary))'),
}

/** develop selected the text from the outer modifier; the color is looked up for the text instead. */
export const pageTitleTextColors: Record<PageTitleColor, StyleRecipe> = {
  dark: pageTitle_text__dark,
  primary: pageTitle_text__primary,
}
