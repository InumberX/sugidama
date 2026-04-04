import { style } from '@vanilla-extract/css'

import { getClampPx } from '~/styles/mixins/size.css'
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

export const drinkRelated = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const drinkRelated_container = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: getClampPx(24, 40),
    },
  },
})
