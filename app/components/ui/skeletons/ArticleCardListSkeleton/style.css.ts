import { style } from '@vanilla-extract/css'

import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentUiLow, cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const articleCardListSkeleton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleCardListSkeleton_items = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
      gap: 24,
    },
  },
})

export const articleCardListSkeleton_item = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleCardListSkeletonCard = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `
        "thumbnail"
        "description"
        "title"
      `,
      borderRadius: 16,
      backgroundColor: cssVariables.color.background.subLight.hex,
      overflow: 'hidden',
      paddingBlockEnd: 16,
      blockSize: '100%',
    },
  },
})

export const articleCardListSkeletonCardTitle = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'title',
    },
  },
})

export const articleCardListSkeletonCardTitle_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      paddingBlock: '12px 0',
      paddingInline: 16,
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 4,
    },
  },
})

export const articleCardListSkeletonCardTitle_skeleton = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const articleCardListSkeletonCardDescription = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'description',
    },
  },
})

export const articleCardListSkeletonCardDescription_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      paddingBlock: '12px 0',
      paddingInline: 16,
    },
  },
})

export const articleCardListSkeletonCardDescription_skeleton = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      maxInlineSize: 120,
    },
  },
})

export const articleCardListSkeletonCardThumbnail = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridArea: 'thumbnail',
      inlineSize: '100%',
    },
  },
})

export const articleCardListSkeletonCardThumbnail_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleCardListSkeletonCardThumbnail_skeleton = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      borderRadius: 0,
    },
  },
})
