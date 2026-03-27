import { style } from '@vanilla-extract/css'

import { getContainerQuery } from '~/styles/mixins/mediaQuery.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

export const drink = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const drink_wrapper = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const drink_container = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})
