// Ported from develop: app/components/ui/buttons/SvgIconCircleButton/style.css.ts
//
// The contained primary look of BaseButton in a circle: two stacked gradients,
// light (`::before`) over dark (`::after`), the light one fading out on hover.
import { MEDIA_QUERY } from '../../../../../../ui/styles/public/media-query.ts'
import { getTransition, type StyleRecipe } from '../../../../../../ui/styles/public/mixins.ts'
import type { SvgIconCircleButtonSize } from './svg-icon-circle-button.types.ts'

const CIRCLE = 'calc(infinity * 1px)'

export const svgIconCircleButton: StyleRecipe = {
  aspectRatio: '1 / 1',
  borderRadius: CIRCLE,
  isolation: 'isolate',
  justifyContent: 'center',
  overflow: 'hidden',
  '&::before, &::after': {
    blockSize: '100%',
    borderRadius: 'inherit',
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
  [MEDIA_QUERY.HOVER]: { '&:hover::before': { opacity: 0 } },
}

export const svgIconCircleButtonSizes: Record<SvgIconCircleButtonSize, StyleRecipe> = {
  large: { padding: '12px' },
  medium: { padding: '4px' },
  small: { padding: '2px' },
}

/** `cursor` and `pointer-events` come from the primitive. */
export const svgIconCircleButton__disabled: StyleRecipe = {
  opacity: 'var(--opacity-disabled)',
}

/** The icon, lifted above both gradient layers. */
export const svgIconCircleButton_container: StyleRecipe = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 3,
}

const icon = (inlineSize: string): StyleRecipe => ({
  backgroundColor: 'var(--color-background-light)',
  inlineSize,
})

export const svgIconCircleButtonIconSizes: Record<SvgIconCircleButtonSize, StyleRecipe> = {
  large: icon('40px'),
  medium: icon('32px'),
  small: icon('24px'),
}
