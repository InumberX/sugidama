import { style, createContainer } from '@vanilla-extract/css'

import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const layoutMainContainer = createContainer()

export const layoutMain = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      inlineSize: '100%',
      containerType: 'inline-size',
      containerName: layoutMainContainer,
    },
  },
})
