import { style } from '@vanilla-extract/css'

import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontCaption } from '~/styles/variables/font.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const helperText = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontCaption,
      color: cssVariables.color.font.subDark.hex,
    },
  },
})
