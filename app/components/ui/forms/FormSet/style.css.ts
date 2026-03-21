import { style } from '@vanilla-extract/css'

import { getClampPx } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontLargeBold, fontCaptionBold, fontCaption, fontSmallBold } from '~/styles/variables/font.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const formSet__first = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const formSet__last = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const formSet__small = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const formSet__medium = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const formSet = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      paddingBlock: getClampPx(8, 16),
      paddingInline: 0,

      selectors: {
        [`&${formSet__first}`]: {
          paddingBlockStart: 0,
        },

        [`&${formSet__last}`]: {
          paddingBlockEnd: 0,
        },
      },
    },
  },
})

export const formSetTitle = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
    },
  },
})

export const formSetTitle_container = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px 12px',
    },
  },
})

export const formSetTitle_container__vertical = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      flexDirection: 'column',
    },
  },
})

export const formSetTitle_text = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontLargeBold,
      display: 'block',
      color: cssVariables.color.font.subDark.hex,

      selectors: {
        [`${formSet__small} &`]: {
          ...fontSmallBold,
          color: cssVariables.color.font.subDark.hex,
        },
      },
    },
  },
})

export const formSetTitle_sub = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontCaption,
      display: 'block',
      color: cssVariables.color.font.sub.hex,
    },
  },
})

export const formSetTitleRequired = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      flexShrink: 0,
      display: 'block',
      marginInlineStart: 16,
      marginBlockStart: 4,
    },
  },
})

export const formSetTitleRequired_text = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontCaptionBold,
      display: 'block',
      color: cssVariables.color.font.required.hex,
    },
  },
})

export const formSetContents = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      marginBlockStart: getClampPx(8, 16),

      selectors: {
        [`${formSet__small} &`]: {
          marginBlockStart: 8,
        },
      },
    },
  },
})
