import { style } from '@vanilla-extract/css'

import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontCaption } from '~/styles/variables/font.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const textArea = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const textArea_wrapper = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 4,
    },
  },
})

export const textArea_container = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const textArea_input__error = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const textArea_input = style({
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

        [`&:where(${textArea}:has(${textArea_input__error}) &)`]: {
          backgroundColor: cssVariables.color.background.errorLight.hex,
          borderColor: cssVariables.color.border.error.hex,
        },

        [`&:where(${textArea}:has(${textArea_input__error}) &):focus`]: {
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

            [`&:where(${textArea}:has(${textArea_input__error}) &):hover`]: {
              borderColor: cssVariables.color.border.error.hex,
            },
          },
        },
      },
    },
  },
})

export const textArea_label = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      position: 'relative',

      selectors: {
        [`&:where(${textArea}:has(${textArea_input}[readonly]) &)`]: {
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },

        [`&:where(${textArea}:has(${textArea_input}:disabled) &)`]: {
          cursor: 'not-allowed',
        },
      },
    },
  },
})

export const textAreaErrorMessage = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const textAreaMaxLength = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  },
})

export const textAreaMaxLength_paragraph = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      flexWrap: 'wrap',
      ...fontCaption,
      color: cssVariables.color.font.subDark.hex,
      gap: '0 2px',
    },
  },
})

export const textAreaMaxLength_text = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'block',
    },
  },
})
