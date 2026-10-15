// Ported from develop: app/components/ui/buttons/BaseButton/style.css.ts
//
// Styled tier: this is where design decisions live. Recipes are plain objects
// so the primitive can spread them over its reset in a single css(...) call.
// develop expressed color × variant as class-combination selectors
// (`&${baseButton__contained}`); here the combination is looked up in
// `baseButtonColors` and spread, so JS decides which declaration wins.
import { MEDIA_QUERY } from '../../styles/public/media-query.ts'
import { getClampPx, getTransition, type StyleRecipe } from '../../styles/public/mixins.ts'
import { fontLargeBold, fontMediumBold, fontSmallBold } from '../../styles/public/tokens.ts'
import type { BaseButtonColor, BaseButtonSize, BaseButtonVariant } from './base-button.types.ts'

const PILL = 'calc(infinity * 1px)'

export const baseButton: StyleRecipe = {
  alignItems: 'center',
  blockSize: 'auto',
  borderRadius: PILL,
  cursor: 'pointer',
  display: 'inline-flex',
  inlineSize: 'auto',
  justifyContent: 'center',
  position: 'relative',
  textAlign: 'start',
  transition: getTransition([
    { property: 'color' },
    { property: 'opacity' },
    { property: 'background-color' },
    { property: 'border-color' },
  ]),
}

export const baseButton__large: StyleRecipe = {
  ...fontLargeBold,
  paddingBlock: '16px',
  paddingInline: getClampPx(24, 64),
}

export const baseButton__medium: StyleRecipe = {
  ...fontMediumBold,
  paddingBlock: '14px',
  paddingInline: getClampPx(20, 48),
}

export const baseButton__small: StyleRecipe = {
  ...fontSmallBold,
  paddingBlock: '12px',
  paddingInline: getClampPx(16, 40),
}

export const baseButtonSizes: Record<BaseButtonSize, StyleRecipe> = {
  large: baseButton__large,
  medium: baseButton__medium,
  small: baseButton__small,
}

/**
 * The hover fade for the two stacked gradients the color recipe draws:
 * `::before` (the light one) sits over `::after` (the dark one) and fades out,
 * which is how develop animated between two gradients — `background` itself
 * cannot transition. The pseudo-elements live in the color recipe because the
 * spread is shallow: a `'&::before'` key there would replace one here whole.
 */
export const baseButton__contained: StyleRecipe = {
  border: 'none',
  [MEDIA_QUERY.HOVER]: { '&:hover::before': { opacity: 0 } },
}

export const baseButton__outlined: StyleRecipe = {
  border: '1px solid',
  boxShadow: 'none',
}

export const baseButtonVariants: Record<BaseButtonVariant, StyleRecipe> = {
  contained: baseButton__contained,
  outlined: baseButton__outlined,
}

/** Spread after the variant; each entry fills in the colors that variant leaves open. */
export const baseButtonColors: Record<BaseButtonColor, Record<BaseButtonVariant, StyleRecipe>> = {
  primary: {
    contained: {
      backgroundColor: 'transparent',
      color: 'var(--color-font-light)',
      '&::before, &::after': {
        blockSize: '100%',
        borderRadius: PILL,
        content: '""',
        inlineSize: '100%',
        insetBlockStart: 0,
        insetInlineStart: 0,
        position: 'absolute',
      },
      '&::before': {
        background: 'linear-gradient(90deg, var(--color-gradation-primary))',
        transition: getTransition([{ property: 'opacity' }]),
        zIndex: 2,
      },
      '&::after': {
        background: 'linear-gradient(90deg, var(--color-gradation-primary-dark))',
        zIndex: 1,
      },
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: 'var(--color-border-primary)',
      color: 'var(--color-font-primary)',
      [MEDIA_QUERY.HOVER]: {
        '&:hover': {
          backgroundColor: 'var(--color-background-primary)',
          color: 'var(--color-font-light)',
        },
      },
    },
  },
}

/**
 * develop dimmed a disabled button; the port had dropped it, so a disabled
 * button looked live. `cursor` and `pointer-events` come from the primitive.
 */
export const baseButton__disabled: StyleRecipe = {
  opacity: 'var(--opacity-disabled)',
}

/** The label row, lifted above both gradient layers. */
export const baseButton_container: StyleRecipe = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 3,
}

export const baseButton_text: StyleRecipe = {
  display: 'block',
}
