import { style, createContainer } from '@vanilla-extract/css'

import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const layoutMainContainer = createContainer()

export const layoutMain = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      inlineSize: '100%',
      flexGrow: 1,
      containerType: 'inline-size',
      containerName: layoutMainContainer,
      marginInline: 'auto',
      maxInlineSize: `calc(${cssVariables.layout.inner.maxWidth.large} + (16px * 2))`,
      paddingInline: 16,
      display: 'flex',
      flexDirection: 'column',
    },
  },
})

export const layoutMain_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      backgroundColor: cssVariables.color.background.light.hex,
      flexGrow: 1,
    },
  },
})
