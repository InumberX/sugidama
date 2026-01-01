import { style } from '@vanilla-extract/css'

import { getTextGradation } from '~/styles/mixins/color.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontHeading1 } from '~/styles/variables/font.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const pageTitle__dark = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const pageTitle__primary = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const pageTitle = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const pageTitle_wrapper = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      paddingBlock: getClampPx(24, 40),
    },
  },
})

export const pageTitle_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const pageTitle_contents = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const pageTitle_paragraph = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontHeading1,
      color: cssVariables.color.font.subDark.hex,
      display: 'flex',
    },
  },
})

export const pageTitle_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'block',

      selectors: {
        [`${pageTitle__primary} &`]: {
          ...getTextGradation(`linear-gradient(90deg, ${cssVariables.color.gradation.primary})`),
        },
      },
    },
  },
})
