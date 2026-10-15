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

/**
 * Only what differs from the primitive's reset; `display: inline-flex`,
 * `align-items`, `position: relative` and the rest come from there.
 *
 * No `cursor`, as in develop: an `<a href>` and a `<button>` already show the
 * pointer (user agent and app.css), while a `nonClickableTag` label inherits
 * its parent's — the pointer inside a card's link, the default on its own.
 */
export const baseButton: StyleRecipe = {
  borderRadius: PILL,
  // The gradient layers and the label stack at z-index 1–3. Without a context
  // of their own they would compete with the page's positioned elements (a
  // sticky header, a popover) instead of only with each other.
  isolation: 'isolate',
  justifyContent: 'center',
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
 * Empty on purpose: the reset already has no border, and everything the
 * contained look needs — the gradient layers and their hover — depends on the
 * color, so it lives in `baseButtonColors`. Kept as the variant's named slot.
 */
export const baseButton__contained: StyleRecipe = {}

export const baseButton__outlined: StyleRecipe = {
  border: '1px solid',
}

export const baseButtonVariants: Record<BaseButtonVariant, StyleRecipe> = {
  contained: baseButton__contained,
  outlined: baseButton__outlined,
}

/**
 * The primary color on the contained variant: two stacked gradients, light
 * (`::before`) over dark (`::after`).
 */
export const baseButton__primaryContained: StyleRecipe = {
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
  // The hover fades the light layer out to reveal the dark one — `background`
  // itself cannot transition between gradients. It lives here, beside the
  // pseudo-elements it targets, because the spread is shallow: a
  // `[MEDIA_QUERY.HOVER]` key here would replace one in the variant whole.
  [MEDIA_QUERY.HOVER]: { '&:hover::before': { opacity: 0 } },
}

/** The primary color on the outlined variant: filled in on hover. */
export const baseButton__primaryOutlined: StyleRecipe = {
  backgroundColor: 'transparent',
  borderColor: 'var(--color-border-primary)',
  color: 'var(--color-font-primary)',
  [MEDIA_QUERY.HOVER]: {
    '&:hover': {
      backgroundColor: 'var(--color-background-primary)',
      color: 'var(--color-font-light)',
    },
  },
}

/** Spread after the variant; each entry fills in the colors that variant leaves open. */
export const baseButtonColors: Record<BaseButtonColor, Record<BaseButtonVariant, StyleRecipe>> = {
  primary: {
    contained: baseButton__primaryContained,
    outlined: baseButton__primaryOutlined,
  },
}

/**
 * develop dimmed a disabled button; the port had dropped it, so a disabled
 * button looked live. `cursor` and `pointer-events` come from the primitive,
 * which spreads its disabled recipe after this tier's, so nothing here can
 * override them.
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
