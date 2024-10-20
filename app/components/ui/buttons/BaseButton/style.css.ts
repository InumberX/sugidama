import { style } from '@vanilla-extract/css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const baseButton__disabled = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      cursor: 'not-allowed',
      opacity: cssVariables.opacity.disabled,
      pointerEvents: 'none',
    },
  },
})

export const baseButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const baseButton_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const baseButton_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})
