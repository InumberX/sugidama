import { style } from '@vanilla-extract/css'

import { getContainerQuery } from '~/styles/mixins/mediaQuery.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

export const drinks = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const drinks_container = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gap: 0,
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `
        "side"
        "result"
      `,

      '@container': {
        [getContainerQuery('md')]: {
          gap: `0 ${getClampPx(24, 40)}`,
          gridTemplateColumns: `${getClampPx(240, 360)} 1fr`,
          gridTemplateAreas: `
            "side result"
          `,
        },
      },
    },
  },
})

export const drinks_side = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'side',

      '@container': {
        [getContainerQuery('md')]: {
          borderInlineEnd: `1px solid ${cssVariables.color.border.sub.hex}`,
        },
      },
    },
  },
})

export const drinks_result = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'result',
    },
  },
})
