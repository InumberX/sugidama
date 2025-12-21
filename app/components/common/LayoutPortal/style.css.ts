import { style } from '@vanilla-extract/css'

import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const layoutPortal = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const layoutPortal_modal = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})
