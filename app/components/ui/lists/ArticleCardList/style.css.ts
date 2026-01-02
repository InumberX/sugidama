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

export const articleCardList_items = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
      gap: 24,
    },
  },
})

export const articleCardList_item = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      selectors: {},
    },
  },
})
