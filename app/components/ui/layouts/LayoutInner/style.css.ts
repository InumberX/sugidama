import { style } from '@vanilla-extract/css'

import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const layoutInner__large = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      maxInlineSize: `calc(${cssVariables.layout.inner.width.large} + (${cssVariables.layout.inner.padding.md} * 2))`,
    },
  },
})

export const layoutInner__full = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      maxInlineSize: 'none',
    },
  },
})

export const layoutInner = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      marginBlock: 0,
      marginInline: 'auto',
      paddingBlock: 0,
      paddingInline: cssVariables.layout.inner.padding.xs,
      inlineSize: '100%',

      '@media': {
        [getMediaQuery('sm')]: {
          paddingInline: cssVariables.layout.inner.padding.sm,
        },

        [getMediaQuery('md')]: {
          paddingInline: cssVariables.layout.inner.padding.md,
        },
      },
    },
  },
})
