import { style } from '@vanilla-extract/css'

import { getLineClamp } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontCaption, fontSmallBold } from '~/styles/variables/font.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const articleCompactCard_clickable = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleCompactCard = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gridTemplateRows: 'auto 1fr auto',
      gridTemplateAreas: `
        "thumbnail description"
        "thumbnail title"
        "thumbnail tags"
      `,
      borderRadius: 12,
      backgroundColor: cssVariables.color.background.subLight.hex,
      overflow: 'hidden',
      blockSize: '100%',
    },
  },
})

export const articleCompactCardDescription = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'description',
    },
  },
})

export const articleCompactCardDescription_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontCaption,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      blockSize: '100%',
      inlineSize: '100%',
      color: cssVariables.color.font.subDark.hex,
      paddingBlock: '12px 0',
      paddingInline: 12,
      backgroundColor: 'transparent',
      border: 'none',
      textDecoration: 'none',
      boxShadow: 'none',
      textAlign: 'start',
    },
  },
})

export const articleCompactCardDescription_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...getLineClamp(2),
    },
  },
})

export const articleCompactCardTags = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'tags',
      marginBlockStart: 8,
      paddingInline: 12,
      paddingBlockEnd: 12,
    },
  },
})

export const articleCompactCardThumbnail = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'thumbnail',
      position: 'relative',
    },
  },
})

export const articleCompactCardThumbnail_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      blockSize: '100%',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingBlock: 12,
      paddingInline: '12px 0',
      backgroundColor: 'transparent',
      border: 'none',
      textDecoration: 'none',
      boxShadow: 'none',
      position: 'relative',
      zIndex: 1,
      inlineSize: getClampPx(120, 160),
    },
  },
})

export const articleCompactCardThumbnail_contents = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      inlineSize: '100%',
      overflow: 'hidden',
      aspectRatio: '16 / 9',
      borderRadius: 8,
    },
  },
})

export const articleCompactCardThumbnail_image = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      inlineSize: '100%',
      blockSize: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      transition: getTransition([
        {
          property: 'scale',
        },
      ]),

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`&:where(${articleCompactCard}:has(${articleCompactCard_clickable}:hover) &)`]: {
              scale: cssVariables.scale.hover,
            },
          },
        },
      },
    },
  },
})

export const articleCompactCardTitle = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'title',
    },
  },
})

export const articleCompactCardTitle_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontSmallBold,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      blockSize: '100%',
      inlineSize: '100%',
      color: cssVariables.color.font.base.hex,
      paddingBlock: 12,
      paddingInline: 12,
      backgroundColor: 'transparent',
      border: 'none',
      textDecoration: 'none',
      boxShadow: 'none',
      textAlign: 'start',
      transition: getTransition([
        {
          property: 'color',
        },
      ]),

      selectors: {
        [`&:where(${articleCompactCard}:has(${articleCompactCardDescription}) &)`]: {
          paddingBlockStart: 4,
        },

        [`&:where(${articleCompactCard}:has(${articleCompactCardTags}) &)`]: {
          paddingBlockEnd: 0,
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`&:where(${articleCompactCard}:has(${articleCompactCard_clickable}:hover) &)`]: {
              color: cssVariables.color.font.primary.hex,
            },
          },
        },
      },
    },
  },
})

export const articleCompactCardTitle_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...getLineClamp(2),
    },
  },
})
