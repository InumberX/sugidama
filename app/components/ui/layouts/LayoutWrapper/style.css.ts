import { style } from '@vanilla-extract/css'

import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const layoutWrapper = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'flex',
      flexDirection: 'column',
      minBlockSize: ['100vb', '100svb'],
      position: 'relative',
    },
  },
})
