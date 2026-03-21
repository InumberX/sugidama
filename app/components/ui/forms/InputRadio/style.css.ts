import { style } from '@vanilla-extract/css'

import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontCaption, fontSmall } from '~/styles/variables/font.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const inputRadio = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const inputRadio_wrapper = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const inputRadio_container = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      overflow: 'hidden',
    },
  },
})

export const inputRadio_items = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 16,
    },
  },
})

export const inputRadio_item = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const inputRadio_input__error = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const inputRadio_input = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      insetBlockStart: 0,
      insetInlineStart: 0,
      opacity: 0,
      position: 'absolute',
    },
  },
})

export const inputRadio_label = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      position: 'relative',
      transition: getTransition([
        {
          property: 'opacity',
        },
      ]),

      selectors: {
        [`&:where(&:has(${inputRadio_input}[readonly]))`]: {
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },

        [`&:where(&:has(${inputRadio_input}:disabled))`]: {
          opacity: cssVariables.opacity.disabled,
          cursor: 'not-allowed',
        },
      },
    },
  },
})

export const inputRadio_contents = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gridTemplateRows: 'auto',
      paddingBlock: 8,
      paddingInline: '8px 16px',
    },
  },
})

export const inputRadioIcon = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      gridColumn: '1 / 2',
      gridRow: '1 / 2',
      alignItems: 'center',
      aspectRatio: '1 / 1',
      borderBlock: `2px solid ${cssVariables.color.border.sub.hex}`,
      borderInline: `2px solid ${cssVariables.color.border.sub.hex}`,
      borderRadius: 'calc(infinity * 1px)',
      display: 'flex',
      inlineSize: 24,
      blockSize: 'auto',
      justifyContent: 'center',
      position: 'relative',
      transition: getTransition([
        {
          property: 'border-color',
        },
      ]),

      selectors: {
        [`&:where(${inputRadio_label}:has(${inputRadio_input}:focus) &)`]: {
          borderColor: cssVariables.color.border.primary.hex,
        },

        [`&:where(${inputRadio_label}:has(${inputRadio_input}[readonly]) &)`]: {
          borderColor: cssVariables.color.border.sub.hex,
          backgroundColor: cssVariables.color.background.subLight.hex,
        },

        [`&:where(${inputRadio_label}:has(${inputRadio_input}:disabled) &)`]: {
          borderColor: cssVariables.color.border.sub.hex,
        },

        [`&:where(${inputRadio_label}:has(${inputRadio_input}:checked) &)`]: {
          borderColor: cssVariables.color.border.primary.hex,
        },

        [`&:where(${inputRadio_label}:has(${inputRadio_input}:checked:focus) &)`]: {
          borderColor: cssVariables.color.border.primary.hex,
        },

        [`&:where(${inputRadio_label}:has(${inputRadio_input}[readonly]:checked) &)`]: {
          borderColor: cssVariables.color.border.sub.hex,
          backgroundColor: cssVariables.color.background.subLight.hex,
        },

        [`&:where(${inputRadio_label}:has(${inputRadio_input__error}) &)`]: {
          borderColor: cssVariables.color.border.error.hex,
        },

        [`&:where(${inputRadio_label}:has(${inputRadio_input__error}:checked) &)`]: {
          borderColor: cssVariables.color.border.error.hex,
        },

        [`&:where(${inputRadio_label}:has(${inputRadio_input__error}:checked:focus) &)`]: {
          borderColor: cssVariables.color.border.error.hex,
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`&:where(${inputRadio_label}:has(${inputRadio_input}:hover) &)`]: {
              borderColor: cssVariables.color.border.primary.hex,
            },

            [`&:where(${inputRadio_label}:has(${inputRadio_input}[readonly]:hover) &)`]: {
              borderColor: cssVariables.color.border.sub.hex,
              backgroundColor: cssVariables.color.background.subLight.hex,
            },

            [`&:where(${inputRadio_label}:has(${inputRadio_input}:disabled:hover) &)`]: {
              borderColor: cssVariables.color.border.sub.hex,
            },

            [`&:where(${inputRadio_label}:has(${inputRadio_input}:checked:hover) &)`]: {
              borderColor: cssVariables.color.border.primary.hex,
            },

            [`&:where(${inputRadio_label}:has(${inputRadio_input}[readonly]:checked:hover) &)`]: {
              borderColor: cssVariables.color.border.sub.hex,
              backgroundColor: cssVariables.color.background.subLight.hex,
            },

            [`&:where(${inputRadio_label}:has(${inputRadio_input__error}:hover) &)`]: {
              borderColor: cssVariables.color.border.error.hex,
            },

            [`&:where(${inputRadio_label}:has(${inputRadio_input__error}:checked:hover) &)`]: {
              borderColor: cssVariables.color.border.error.hex,
            },
          },
        },
      },
    },
  },
})

export const inputRadioIcon_icon = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      opacity: 0,
      inlineSize: 16,
      aspectRatio: '1 / 1',
      blockSize: 'auto',
      borderRadius: 'calc(infinity * 1px)',
      backgroundColor: cssVariables.color.background.primary.hex,
      transition: getTransition([
        {
          property: 'opacity',
        },
        {
          property: 'background-color',
        },
      ]),

      selectors: {
        [`&:where(${inputRadio_label}:has(${inputRadio_input}:checked) &)`]: {
          opacity: 1,
        },

        [`&:where(${inputRadio_label}:has(${inputRadio_input}[readonly]) &)`]: {
          backgroundColor: cssVariables.color.background.sub.hex,
        },

        [`&:where(${inputRadio_label}:has(${inputRadio_input__error}) &)`]: {
          backgroundColor: cssVariables.color.background.errorLight.hex,
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`&:where(${inputRadio_label}:has(${inputRadio_input__error}:hover) &)`]: {
              backgroundColor: cssVariables.color.background.errorLight.hex,
            },

            [`&:where(${inputRadio_label}:has(${inputRadio_input__error}:checked:hover) &)`]: {
              backgroundColor: cssVariables.color.background.errorLight.hex,
            },
          },
        },
      },
    },
  },
})

export const inputRadio_text = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'block',
      gridColumn: '2 / 3',
      gridRow: '1 / 2',
      marginInlineStart: 8,
      fontSize: getFontSize(16),
      fontWeight: cssVariables.font.weight.medium,
      transition: getTransition([
        {
          property: 'color',
        },
      ]),

      selectors: {
        [`&:where(${inputRadio_label}:has(${inputRadio_input}[readonly]) &)`]: {
          color: cssVariables.color.font.subDark.hex,
        },
      },
    },
  },
})

export const inputRadio_helperText = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontCaption,
      marginBlockStart: 4,
      color: cssVariables.color.font.sub.hex,
    },
  },
})

export const inputRadioErrorMessage = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontSmall,
      marginBlockStart: 4,
      color: cssVariables.color.font.error.hex,
    },
  },
})

export const inputRadioErrorMessage_text = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'block',
    },
  },
})
