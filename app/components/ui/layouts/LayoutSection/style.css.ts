import { style } from '@vanilla-extract/css'

import { getClampPx } from '~/styles/mixins/size.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const layoutSection__default = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const layoutSection__topSpaceNone = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      paddingBlockStart: 0,
    },
  },
})

export const layoutSection__topSpaceSmall = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      paddingBlockStart: getClampPx(24, 40),
    },
  },
})

export const layoutSection__topSpaceMedium = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      paddingBlockStart: getClampPx(40, 80),
    },
  },
})

export const layoutSection__bottomSpaceNone = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      paddingBlockEnd: 0,
    },
  },
})

export const layoutSection__bottomSpaceSmall = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      paddingBlockEnd: getClampPx(24, 40),
    },
  },
})

export const layoutSection__bottomSpaceMedium = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      paddingBlockEnd: getClampPx(40, 80),
    },
  },
})

export const layoutSection = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      marginBlock: 0,
      marginInline: 0,
      paddingInline: 0,
      inlineSize: '100%',
    },
  },
})
