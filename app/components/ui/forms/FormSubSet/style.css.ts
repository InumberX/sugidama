import { style } from '@vanilla-extract/css'

import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontCaption } from '~/styles/variables/font.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const formSubSet__first = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const formSubSet__last = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const formSubSet = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      paddingBlock: 8,
      paddingInline: 0,

      selectors: {
        [`&${formSubSet__first}`]: {
          paddingBlockStart: 0,
        },

        [`&${formSubSet__last}`]: {
          paddingBlockEnd: 0,
        },
      },
    },
  },
})

export const formSubSetTitle = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
    },
  },
})

export const formSubSetTitle_container = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
    },
  },
})

export const formSubSetTitle_text = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontCaption,
      display: 'block',
      color: cssVariables.color.font.subDark.hex,
    },
  },
})

export const formSubSetContents = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      marginBlockStart: 8,
    },
  },
})
