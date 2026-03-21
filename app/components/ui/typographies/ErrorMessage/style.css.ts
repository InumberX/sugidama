import { style } from '@vanilla-extract/css'

import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontSmall } from '~/styles/variables/font.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const errorMessage = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontSmall,
      display: 'block',
      color: cssVariables.color.font.error.hex,
    },
  },
})
