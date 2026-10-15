// Ported from develop: app/components/ui/tags/BaseTag/style.css.ts
//
// develop expressed color × variant as class-combination selectors
// (`&${baseTag__contained}`); here the combination is looked up and spread,
// as in base-button.styles.ts.
import { MEDIA_QUERY } from '../../styles/public/media-query.ts'
import { getTransition, type StyleRecipe } from '../../styles/public/mixins.ts'
import { fontCaption } from '../../styles/public/tokens.ts'
import type { BaseTagColor, BaseTagVariant } from './base-tag.types.ts'

/** Only what differs from the primitive's reset. */
export const baseTag: StyleRecipe = {
  ...fontCaption,
  border: '1px solid',
  borderRadius: 'calc(infinity * 1px)',
  justifyContent: 'center',
  paddingBlock: '4px',
  paddingInline: '8px',
  transition: getTransition([
    { property: 'color' },
    { property: 'opacity' },
    { property: 'background-color' },
    { property: 'border-color' },
  ]),
}

/** Empty on purpose: everything either variant needs depends on the color. Named slots. */
export const baseTag__contained: StyleRecipe = {}
export const baseTag__outlined: StyleRecipe = {}

export const baseTagVariants: Record<BaseTagVariant, StyleRecipe> = {
  contained: baseTag__contained,
  outlined: baseTag__outlined,
}

export const baseTag__subContained: StyleRecipe = {
  backgroundColor: 'var(--color-background-sub-dark)',
  borderColor: 'var(--color-border-sub-dark)',
  color: 'var(--color-font-light)',
}

export const baseTag__subOutlined: StyleRecipe = {
  borderColor: 'var(--color-border-sub-dark)',
  color: 'var(--color-font-sub-dark)',
}

/** Spread after the variant; each entry fills in the colors that variant leaves open. */
export const baseTagColors: Record<BaseTagColor, Record<BaseTagVariant, StyleRecipe>> = {
  sub: { contained: baseTag__subContained, outlined: baseTag__subOutlined },
}

/** The colors swap on hover. */
export const baseTag__subContainedHover: StyleRecipe = {
  [MEDIA_QUERY.HOVER]: {
    '&:hover': {
      backgroundColor: 'var(--color-background-light)',
      color: 'var(--color-font-sub-dark)',
    },
  },
}

export const baseTag__subOutlinedHover: StyleRecipe = {
  [MEDIA_QUERY.HOVER]: {
    '&:hover': {
      backgroundColor: 'var(--color-background-sub-dark)',
      color: 'var(--color-font-light)',
    },
  },
}

/** Only a link or a button reacts to hover; an inert tag stays as it is. */
export const baseTagHovers: Record<BaseTagColor, Record<BaseTagVariant, StyleRecipe>> = {
  sub: { contained: baseTag__subContainedHover, outlined: baseTag__subOutlinedHover },
}

/** `cursor` and `pointer-events` come from the primitive's disabled recipe. */
export const baseTag__disabled: StyleRecipe = {
  opacity: 'var(--opacity-disabled)',
}

export const baseTag_container: StyleRecipe = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
}

export const baseTag_text: StyleRecipe = {
  display: 'block',
}
