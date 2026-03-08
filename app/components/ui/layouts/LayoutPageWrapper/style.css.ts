import { style } from '@vanilla-extract/css'

import { layoutHeaderHeight } from '~/components/common/LayoutHeader/style.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const layoutPageWrapper = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      paddingInline: 0,
      paddingBlock: getClampPx(layoutHeaderHeight.minimum, layoutHeaderHeight.maximum),
    },
  },
})
