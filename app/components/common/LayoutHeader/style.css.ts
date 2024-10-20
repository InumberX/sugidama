import { style } from '@vanilla-extract/css'
import { cssLayerComponentCommon } from '~/styles/variables/layers.css'

export const layoutHeader = style({
  '@layer': {
    [cssLayerComponentCommon]: {},
  },
})
