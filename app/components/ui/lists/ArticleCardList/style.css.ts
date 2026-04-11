import { style } from '@vanilla-extract/css'

import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const articleCardList = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'block',
      inlineSize: '100%',
    },
  },
})

export const articleCardList_items__small = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const articleCardList_items__medium = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const articleCardList_items = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'grid',
      gap: 24,

      selectors: {
        [`&${articleCardList_items__small}`]: {
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))',
        },

        [`&${articleCardList_items__medium}`]: {
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
        },
      },
    },
  },
})

export const articleCardList_item = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})
