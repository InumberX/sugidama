import { style } from '@vanilla-extract/css'

import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const inputText = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const inputText_container = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 4,
    },
  },
})

export const inputText_contents = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'block',
      flexGrow: 1,
    },
  },
})

export const inputText_unit = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'block',
      flexShrink: 0,
      marginInlineStart: 16,
      fontSize: getFontSize(16),
    },
  },
})

export const inputText_input__error = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const inputText_input = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      backgroundColor: cssVariables.color.background.light.hex,
      border: `1px solid ${cssVariables.color.border.sub.hex}`,
      borderRadius: 4,
      paddingBlock: 12,
      paddingInline: 16,
      position: 'relative',
      inlineSize: '100%',
      fontSize: getFontSize(16),
      fontWeight: cssVariables.font.weight.medium,
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
          borderColor: cssVariables.color.border.primary.hex,
        },

        '&[readonly]': {
          cursor: 'not-allowed',
          borderColor: cssVariables.color.border.sub.hex,
          backgroundColor: cssVariables.color.background.subLight.hex,
          color: cssVariables.color.font.subDark.hex,
        },

        '&:disabled': {
          cursor: 'not-allowed',
          opacity: cssVariables.opacity.disabled,
          borderColor: cssVariables.color.border.sub.hex,
        },

        [`&:where(${inputText}:has(${inputText_input__error}) &)`]: {
          backgroundColor: cssVariables.color.background.errorLight.hex,
          borderColor: cssVariables.color.border.error.hex,
        },

        [`&:where(${inputText}:has(${inputText_input__error}) &):focus`]: {
          borderColor: cssVariables.color.border.error.hex,
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              borderColor: cssVariables.color.border.primary.hex,
            },

            '&[readonly]:hover': {
              borderColor: cssVariables.color.border.sub.hex,
            },

            '&:disabled:hover': {
              borderColor: cssVariables.color.border.sub.hex,
            },

            [`&:where(${inputText}:has(${inputText_input__error}) &):hover`]: {
              borderColor: cssVariables.color.border.error.hex,
            },
          },
        },
      },
    },
  },
})

export const inputText_label = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',

      selectors: {
        [`&:where(${inputText}:has(${inputText_input}[readonly]) &)`]: {
          cursor: 'not-allowed',
        },

        [`&:where(${inputText}:has(${inputText_input}:disabled) &)`]: {
          cursor: 'not-allowed',
        },
      },
    },
  },
})

export const inputTextErrorMessage = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})
