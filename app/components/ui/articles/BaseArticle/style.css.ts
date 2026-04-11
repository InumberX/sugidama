import { style } from '@vanilla-extract/css'

import { getContainerQuery } from '~/styles/mixins/mediaQuery.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const baseArticle = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      containerType: 'inline-size',
    },
  },
})

export const baseArticle_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `
        "title"
        "main-visual"
        "info"
        "tags"
      `,

      '@container': {
        [getContainerQuery('sm')]: {
          gridTemplateAreas: `
            "main-visual title"
            "main-visual info"
            "main-visual tags"
          `,
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto auto 1fr',
          gap: `0 ${getClampPx(24, 80)}`,
        },
      },
    },
  },
})

export const baseArticleTitle = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'title',
    },
  },
})

export const baseArticleMainVisual = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'main-visual',
      marginBlockStart: 16,

      '@container': {
        [getContainerQuery('sm')]: {
          marginBlockStart: 0,
        },
      },
    },
  },
})

export const baseArticleInfo = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'info',
      marginBlockStart: 16,
    },
  },
})

export const baseArticleTags = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'tags',
      marginBlockStart: 16,
    },
  },
})
