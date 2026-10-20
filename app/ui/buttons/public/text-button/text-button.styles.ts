// Ported from develop: app/components/ui/buttons/TextButton/style.css.ts
import { MEDIA_QUERY } from '../../../styles/public/media-query.ts'
import { getTransition, type StyleRecipe } from '../../../styles/public/mixins.ts'
import { fontLarge, fontMedium, fontSmall } from '../../../styles/public/tokens.ts'
import type { TextButtonColor, TextButtonSize } from './text-button.types.ts'

/** A link that reads as text: no box, an underline on hover. */
export const textButton: StyleRecipe = {
  transition: getTransition([{ property: 'color' }, { property: 'opacity' }]),
  [MEDIA_QUERY.HOVER]: { '&:hover': { textDecoration: 'underline' } },
}

export const textButton__large: StyleRecipe = { ...fontLarge }
export const textButton__medium: StyleRecipe = { ...fontMedium }
export const textButton__small: StyleRecipe = { ...fontSmall }

export const textButtonSizes: Record<TextButtonSize, StyleRecipe> = {
  large: textButton__large,
  medium: textButton__medium,
  small: textButton__small,
}

export const textButton__sub: StyleRecipe = { color: 'var(--color-font-sub)' }
export const textButton__light: StyleRecipe = { color: 'var(--color-font-light)' }
export const textButton__primary: StyleRecipe = { color: 'var(--color-font-primary)' }
export const textButton__subDark: StyleRecipe = { color: 'var(--color-font-sub-dark)' }

export const textButtonColors: Record<TextButtonColor, StyleRecipe> = {
  sub: textButton__sub,
  light: textButton__light,
  primary: textButton__primary,
  subDark: textButton__subDark,
}

/** `cursor` and `pointer-events` come from the primitive's disabled recipe. */
export const textButton__disabled: StyleRecipe = {
  opacity: 'var(--opacity-disabled)',
}

/** Lifted as in develop, so the label stays above anything positioned over the button. */
export const textButton_container: StyleRecipe = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'flex-start',
  position: 'relative',
  zIndex: 3,
}

export const textButton_text: StyleRecipe = {
  display: 'block',
}
