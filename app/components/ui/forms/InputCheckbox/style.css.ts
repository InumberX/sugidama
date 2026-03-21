import { style } from '@vanilla-extract/css'

import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const inputCheckbox = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const inputCheckbox_wrapper = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const inputCheckbox_container = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      overflow: 'hidden',
    },
  },
})

export const inputCheckbox_items = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 16,
    },
  },
})

export const inputCheckbox_item = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const inputCheckbox_input__error = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const inputCheckbox_input = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      insetBlockStart: 0,
      insetInlineStart: 0,
      opacity: 0,
      position: 'absolute',
    },
  },
})

export const inputCheckbox_label = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      position: 'relative',
      transition: getTransition([
        {
          property: 'opacity',
        },
      ]),

      selectors: {
        [`&:where(&:has(${inputCheckbox_input}[readonly]))`]: {
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },

        [`&:where(&:has(${inputCheckbox_input}:disabled))`]: {
          opacity: cssVariables.opacity.disabled,
          cursor: 'not-allowed',
        },
      },
    },
  },
})

export const inputCheckbox_contents = style({
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

export const inputCheckboxIcon = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      gridColumn: '1 / 2',
      gridRow: '1 / 2',
      aspectRatio: '1 / 1',
      borderBlock: `2px solid ${cssVariables.color.border.sub.hex}`,
      borderInline: `2px solid ${cssVariables.color.border.sub.hex}`,
      borderRadius: 4,
      display: 'block',
      inlineSize: 24,
      blockSize: 'auto',
      position: 'relative',
      zIndex: 1,
      transition: getTransition([
        {
          property: 'border-color',
        },
        {
          property: 'background-color',
        },
      ]),

      selectors: {
        [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input}:focus) &)`]: {
          borderColor: cssVariables.color.border.primary.hex,
        },

        [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input}[readonly]) &)`]: {
          borderColor: cssVariables.color.border.sub.hex,
          backgroundColor: cssVariables.color.background.subLight.hex,
        },

        [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input}:disabled) &)`]: {
          borderColor: cssVariables.color.border.sub.hex,
        },

        [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input}:checked) &)`]: {
          backgroundColor: cssVariables.color.background.primary.hex,
          borderColor: cssVariables.color.border.primary.hex,
        },

        [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input}:checked:focus) &)`]: {
          backgroundColor: cssVariables.color.background.primary.hex,
          borderColor: cssVariables.color.border.primary.hex,
        },

        [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input}[readonly]:checked) &)`]: {
          borderColor: cssVariables.color.border.sub.hex,
          backgroundColor: cssVariables.color.background.sub.hex,
        },

        [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input__error}) &)`]: {
          borderColor: cssVariables.color.border.error.hex,
        },

        [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input__error}:checked) &)`]: {
          backgroundColor: cssVariables.color.background.errorLight.hex,
          borderColor: cssVariables.color.border.error.hex,
        },

        [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input__error}:checked:focus) &)`]: {
          backgroundColor: cssVariables.color.background.errorLight.hex,
          borderColor: cssVariables.color.border.error.hex,
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input}:hover) &)`]: {
              borderColor: cssVariables.color.border.primary.hex,
            },

            [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input}[readonly]:hover) &)`]: {
              borderColor: cssVariables.color.border.sub.hex,
              backgroundColor: cssVariables.color.background.subLight.hex,
            },

            [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input}:disabled:hover) &)`]: {
              borderColor: cssVariables.color.border.sub.hex,
            },

            [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input}:checked:hover) &)`]: {
              backgroundColor: cssVariables.color.background.primary.hex,
              borderColor: cssVariables.color.border.primary.hex,
            },

            [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input}[readonly]:checked:hover) &)`]: {
              borderColor: cssVariables.color.border.sub.hex,
              backgroundColor: cssVariables.color.background.sub.hex,
            },

            [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input__error}:hover) &)`]: {
              borderColor: cssVariables.color.border.error.hex,
            },

            [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input__error}:checked:hover) &)`]: {
              backgroundColor: cssVariables.color.background.errorLight.hex,
              borderColor: cssVariables.color.border.error.hex,
            },
          },
        },
      },
    },
  },
})

export const inputCheckboxIcon_icon = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      insetBlockStart: -2,
      insetInlineStart: -2,
      opacity: 0,
      position: 'absolute',
      inlineSize: 24,
      zIndex: 2,
      backgroundColor: cssVariables.color.background.light.hex,
      transition: getTransition([
        {
          property: 'opacity',
        },
      ]),

      selectors: {
        [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input}:checked) &)`]: {
          opacity: 1,
        },
      },
    },
  },
})

export const inputCheckbox_text = style({
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
        [`&:where(${inputCheckbox_label}:has(${inputCheckbox_input}[readonly]) &)`]: {
          color: cssVariables.color.font.subDark.hex,
        },
      },
    },
  },
})

export const inputCheckboxErrorMessage = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})
