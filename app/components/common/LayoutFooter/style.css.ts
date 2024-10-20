import { style } from '@vanilla-extract/css'
import { cssLayerComponentCommon } from '~/styles/variables/layers.css'

export const layoutFooter = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      marginBlockStart: 'auto',
    },
  },
})
