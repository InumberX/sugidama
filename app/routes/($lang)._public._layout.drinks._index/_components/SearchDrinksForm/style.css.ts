import { style } from '@vanilla-extract/css'

import { getContainerQuery } from '~/styles/mixins/mediaQuery.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

export const searchDrinksForm = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksForm_container = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'relative',
    },
  },
})

export const searchDrinksFormInputs = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'relative',
      zIndex: 1,

      '@container': {
        [getContainerQuery('md')]: {
          paddingBlockEnd: getClampPx(16, 24),
        },
      },
    },
  },
})

export const searchDrinksFormInputs_container = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 16,
    },
  },
})

export const searchDrinksFormInputsHeader = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksFormInputsHeaderReset = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
      justifyContent: 'flex-end',

      '@container': {
        [getContainerQuery('md')]: {
          justifyContent: 'flex-start',
        },
      },
    },
  },
})

export const searchDrinksFormInputsHeaderReset_icon = style({
  '@layer': {
    [cssLayerComponentPage]: {
      flexShrink: 0,
      marginInlineEnd: 8,
      backgroundColor: cssVariables.color.background.sub.hex,
      inlineSize: 20,
    },
  },
})

export const searchDrinksFormInputs_contents = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksFormKeyword = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksSideBottom = style({
  '@layer': {
    [cssLayerComponentPage]: {
      backgroundColor: cssVariables.color.background.light.hex,
      inlineSize: '100%',
      paddingBlock: '16px 0px',

      '@container': {
        [getContainerQuery('md')]: {
          paddingBlock: 16,
          borderBlockStart: `1px solid ${cssVariables.color.border.sub.hex}`,
          insetBlockEnd: 0,
          insetInlineStart: 0,
          position: 'sticky',
          zIndex: 2,
        },
      },
    },
  },
})

export const searchDrinksSideBottom_items = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 16,

      '@container': {
        [getContainerQuery('md')]: {
          gridTemplateColumns: '1fr',
        },
      },
    },
  },
})

export const searchDrinksSideBottom_item__conditions = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksSideBottom_item = style({
  '@layer': {
    [cssLayerComponentPage]: {
      selectors: {
        [`&${searchDrinksSideBottom_item__conditions}`]: {
          '@container': {
            [getContainerQuery('md')]: {
              display: 'none',
            },
          },
        },
      },
    },
  },
})

export const searchDrinksSideBottom_button = style({
  '@layer': {
    [cssLayerComponentPage]: {
      inlineSize: '100%',
    },
  },
})
