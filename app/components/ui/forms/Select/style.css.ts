import { style } from '@vanilla-extract/css'

import { CACHE_BUSTER } from '~/config/env'
import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const select = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const select_container = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 4,
    },
  },
})

export const select_input__error = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const select_input = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      backgroundColor: cssVariables.color.background.light.hex,
      backgroundImage: `url(/assets/img/icon-select-background.svg?${CACHE_BUSTER})`,
      border: `1px solid ${cssVariables.color.border.sub.hex}`,
      borderRadius: 4,
      paddingBlock: 12,
      paddingInline: '16px 48px',
      position: 'relative',
      inlineSize: '100%',
      fontSize: getFontSize(16),
      fontWeight: cssVariables.font.weight.medium,
      backgroundPosition: 'center right 12px',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '24px 24px',
      transition: getTransition([
        {
          property: 'border-color',
        },
        {
          property: 'background-color',
        },
        {
          property: 'color',
        },
        {
          property: 'opacity',
        },
      ]),

      selectors: {
        '&:focus': {
          borderColor: cssVariables.color.background.primary.hex,
        },

        '&[readonly]': {
          cursor: 'not-allowed',
          pointerEvents: 'none',
          borderColor: cssVariables.color.border.sub.hex,
          backgroundColor: cssVariables.color.background.subLight.hex,
          color: cssVariables.color.font.subDark.hex,
        },

        '&:disabled': {
          cursor: 'not-allowed',
          opacity: cssVariables.opacity.disabled,
          borderColor: cssVariables.color.border.sub.hex,
        },

        [`&:where(${select}:has(${select_input__error}) &)`]: {
          backgroundColor: cssVariables.color.background.errorLight.hex,
          borderColor: cssVariables.color.border.error.hex,
        },

        [`&:where(${select}:has(${select_input__error}) &):focus`]: {
          borderColor: cssVariables.color.border.error.hex,
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              borderColor: cssVariables.color.background.primary.hex,
            },

            '&[readonly]:hover': {
              borderColor: cssVariables.color.border.sub.hex,
            },

            '&:disabled:hover': {
              borderColor: cssVariables.color.border.sub.hex,
            },

            [`&:where(${select}:has(${select_input__error}) &):hover`]: {
              borderColor: cssVariables.color.border.error.hex,
            },
          },
        },
      },
    },
  },
})

export const select_label = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      position: 'relative',

      selectors: {
        [`&:where(${select}:has(${select_input}[readonly]) &)`]: {
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },

        [`&:where(${select}:has(${select_input}:disabled) &)`]: {
          cursor: 'not-allowed',
        },
      },
    },
  },
})

export const selectErrorMessage = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})
