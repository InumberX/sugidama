import { style } from '@vanilla-extract/css'

import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontSmall } from '~/styles/variables/font.css'
import { cssLayerComponentUiPrimitive } from '~/styles/variables/layers.css'

export const primitiveButton__disabled = style({
  '@layer': {
    [cssLayerComponentUiPrimitive]: {
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
})

export const primitiveButton = style({
  '@layer': {
    [cssLayerComponentUiPrimitive]: {
      alignItems: 'center',
      blockSize: 'auto',
      borderRadius: 0,
      border: 'none',
      display: 'inline-flex',
      inlineSize: 'auto',
      justifyContent: 'flex-start',
      margin: 0,
      position: 'relative',
      textAlign: 'start',
      textDecoration: 'none',
      padding: 0,
      color: cssVariables.color.font.base.hex,
      backgroundColor: 'transparent',
      ...fontSmall,
      transition: getTransition([
        {
          property: 'color',
        },
        {
          property: 'opacity',
        },
        {
          property: 'background-color',
        },
        {
          property: 'border-color',
        },
      ]),
    },
  },
})
