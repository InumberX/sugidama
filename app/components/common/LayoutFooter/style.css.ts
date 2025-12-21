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
    },
  },
})

export const layoutFooter_wrapper = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      backgroundColor: cssVariables.color.util.black.hex,
      paddingBlockEnd: getClampPx(layoutHeaderHeight.minimum + 24, layoutHeaderHeight.maximum + 24),

      '@media': {
        [getMediaQuery('sm')]: {
          paddingBlockEnd: 0,
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
