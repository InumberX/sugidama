import { style } from '@vanilla-extract/css'

import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontHeading2 } from '~/styles/variables/font.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const sectionTitle = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const sectionTitle_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      position: 'relative',
      paddingInlineStart: 22,
    },
  },
})

export const sectionTitle_divider = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      background: `linear-gradient(180deg, ${cssVariables.color.gradation.primary})`,
      blockSize: '100%',
      inlineSize: 6,
      insetBlockStart: 0,
      insetInlineStart: 0,
      position: 'absolute',
    },
  },
})

export const sectionTitle_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontHeading2,
      color: cssVariables.color.font.base.hex,
    },
  },
})
