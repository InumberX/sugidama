import { style } from '@vanilla-extract/css'

import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const articleCompactCardList = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'block',
      inlineSize: '100%',
    },
  },
})

export const articleCompactCardList_items = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 24,
    },
  },
})

export const articleCompactCardList_item = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      selectors: {},
    },
  },
})
