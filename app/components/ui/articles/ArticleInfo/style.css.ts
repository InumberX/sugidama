import { style } from '@vanilla-extract/css'

import { getContainerQuery } from '~/styles/mixins/mediaQuery.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontMedium, fontMediumBold } from '~/styles/variables/font.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const articleInfo = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleInfo_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleInfo_items = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'grid',
      gridTemplateColumns: '1fr',

      '@container': {
        [getContainerQuery('sm')]: {
          gridTemplateColumns: 'auto 1fr',
        },
      },
    },
  },
})

export const articleInfo_item = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      paddingBlock: getClampPx(8, 12),
      borderBlockStart: `1px solid ${cssVariables.color.border.sub.hex}`,

      selectors: {
        [`${articleInfo_items} > &:last-of-type`]: {
          borderBlockEnd: `1px solid ${cssVariables.color.border.sub.hex}`,
        },
      },

      '@container': {
        [getContainerQuery('sm')]: {
          display: 'grid',
          gridTemplateColumns: 'subgrid',
          gridColumn: 'span 2',
        },
      },
    },
  },
})

export const articleInfo_title = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontMediumBold,
      color: cssVariables.color.font.subDark.hex,

      '@container': {
        [getContainerQuery('sm')]: {
          display: 'flex',

          selectors: {
            '&::after': {
              content: ':',
              paddingInline: 8,
              flexShrink: 0,
              display: 'block',
              marginInlineStart: 'auto',
            },
          },
        },
      },
    },
  },
})

export const articleInfo_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontMedium,
    },
  },
})
