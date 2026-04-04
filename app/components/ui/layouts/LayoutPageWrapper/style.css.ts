import { style } from '@vanilla-extract/css'

import { layoutHeaderHeight } from '~/components/common/LayoutHeader/style.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const layoutPageWrapper__topNoSpace = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const layoutPageWrapper__bottomNoSpace = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const layoutPageWrapper = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      paddingInline: 0,
      paddingBlock: getClampPx(layoutHeaderHeight.minimum, layoutHeaderHeight.maximum),

      selectors: {
        [`&${layoutPageWrapper__topNoSpace}`]: {
          paddingBlockStart: 0,
        },

        [`&${layoutPageWrapper__bottomNoSpace}`]: {
          paddingBlockEnd: 0,
        },
      },
    },
  },
})
