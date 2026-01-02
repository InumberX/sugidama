import { style } from '@vanilla-extract/css'

import { getLineClamp } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontCaption, fontMediumBold } from '~/styles/variables/font.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const articleCard_clickable = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleCard = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `
        "thumbnail"
        "description"
        "title"
        "tags"
      `,
      borderRadius: 16,
      backgroundColor: cssVariables.color.background.subLight.hex,
      overflow: 'hidden',
      paddingBlockEnd: 16,
      blockSize: '100%',
    },
  },
})

export const articleCardTitle = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'title',
    },
  },
})

export const articleCardTitle_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontMediumBold,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      blockSize: '100%',
      inlineSize: '100%',
      color: cssVariables.color.font.base.hex,
      paddingBlock: '12px 0',
      paddingInline: 16,
      backgroundColor: 'transparent',
      border: 'none',
      textDecoration: 'none',
      boxShadow: 'none',
      textAlign: 'start',
      ...getLineClamp(3),
      transition: getTransition([
        {
          property: 'color',
        },
      ]),

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`&:where(${articleCard}:has(${articleCard_clickable}:hover) &)`]: {
              color: cssVariables.color.font.primary.hex,
            },
          },
        },
      },
    },
  },
})

export const articleCardDescription = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'description',
    },
  },
})

export const articleCardDescription_container = style({
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
      paddingInline: 16,
      backgroundColor: 'transparent',
      border: 'none',
      textDecoration: 'none',
      boxShadow: 'none',
      textAlign: 'start',
    },
  },
})

export const articleCardDescription_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...getLineClamp(2),
    },
  },
})

export const articleCardTags = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'tags',
      marginBlockStart: 12,
      paddingInline: 16,
    },
  },
})

export const articleCardThumbnail = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'thumbnail',
      position: 'relative',
    },
  },
})

export const articleCardThumbnail_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      blockSize: '100%',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingBlock: 0,
      paddingInline: 0,
      backgroundColor: 'transparent',
      border: 'none',
      textDecoration: 'none',
      boxShadow: 'none',
      position: 'relative',
      zIndex: 1,
      inlineSize: '100%',
    },
  },
})

export const articleCardThumbnail_contents = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      inlineSize: '100%',
      overflow: 'hidden',
      aspectRatio: '16 / 9',
    },
  },
})

export const articleCardThumbnail_image = style({
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
            [`&:where(${articleCard}:has(${articleCard_clickable}:hover) &)`]: {
              scale: cssVariables.scale.hover,
            },
          },
        },
      },
    },
  },
})
