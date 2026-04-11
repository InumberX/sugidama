import { style } from '@vanilla-extract/css'

import { layoutHeaderHeight } from '~/components/common/LayoutHeader/style.css'
import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontCaptionBold } from '~/styles/variables/font.css'
import { cssLayerComponentCommon } from '~/styles/variables/layers.css'

export const layoutFooter = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      marginBlockStart: 'auto',
      marginInline: 'auto',
      inlineSize: '100%',
      maxInlineSize: `calc(${cssVariables.layout.inner.maxWidth.large} + (16px * 2))`,
      paddingInline: 16,
    },
  },
})

export const layoutFooter_wrapper = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      backgroundColor: cssVariables.color.util.black.hex,
      paddingBlockEnd: getClampPx(layoutHeaderHeight.minimum, layoutHeaderHeight.maximum),

      '@media': {
        [getMediaQuery('sm')]: {
          paddingBlockEnd: 16,
        },
      },
    },
  },
})

export const layoutFooter_container = style({
  '@layer': {
    [cssLayerComponentCommon]: {},
  },
})

export const layoutFooterCopy = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      paddingBlock: 24,
    },
  },
})

export const layoutFooterCopy_paragraph = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      textAlign: 'center',
    },
  },
})

export const layoutFooterCopy_text = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      ...fontCaptionBold,
      color: cssVariables.color.font.light.hex,
    },
  },
})
