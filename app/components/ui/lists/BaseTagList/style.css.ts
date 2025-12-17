import { style } from '@vanilla-extract/css'

import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const baseTagList = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'block',
    },
  },
})

export const baseTagList_items__left = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      justifyContent: 'flex-start',
    },
  },
})

export const baseTagList_items__center = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      justifyContent: 'center',
    },
  },
})

export const baseTagList_items__right = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      justifyContent: 'flex-end',
    },
  },
})

export const baseTagList_items = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
    },
  },
})

export const baseTagList_item = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'block',
    },
  },
})
