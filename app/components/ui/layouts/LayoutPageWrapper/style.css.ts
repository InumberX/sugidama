import { style } from '@vanilla-extract/css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const layoutPageWrapper = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})
