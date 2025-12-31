import { style } from '@vanilla-extract/css'

import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontMediumBold } from '~/styles/variables/font.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const basePagination = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const basePagination_container = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const basePagination_items = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
})

export const basePagination_item__prev = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const basePagination_item__next = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const basePagination_item__separator = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const basePagination_item__current = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const basePagination_item__first = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const basePagination_item__last = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const basePagination_item = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      paddingBlock: 0,
      paddingInline: 4,

      selectors: {
        [`&${basePagination_item__prev}`]: {
          paddingInlineStart: 0,
        },

        [`&${basePagination_item__next}`]: {
          paddingInlineEnd: 0,
        },
      },
    },
  },
})

export const basePaginationButton__disabled = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      cursor: 'not-allowed',
      opacity: cssVariables.opacity.disabled,
      pointerEvents: 'none',
    },
  },
})

export const basePaginationButton__prev = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const basePaginationButton__next = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const basePaginationButton = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontMediumBold,
      aspectRatio: '1 / 1',
      alignItems: 'center',
      blockSize: 'auto',
      borderRadius: 'calc(infinity * 1px)',
      display: 'inline-flex',
      inlineSize: 40,
      justifyContent: 'center',
      marginBlock: 0,
      marginInline: 0,
      paddingBlock: 0,
      paddingInline: 0,
      position: 'relative',
      textAlign: 'start',
      textDecoration: 'none',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      border: 'none',
      lineHeight: 1,
      color: cssVariables.color.font.subDark.hex,
      transition: getTransition([
        {
          property: 'color',
        },
        {
          property: 'opacity',
        },
        {
          property: 'border-color',
        },
        {
          property: 'background-color',
        },
      ]),

      selectors: {
        [`&${basePaginationButton__prev}:before, &${basePaginationButton__prev}:after, &${basePaginationButton__next}:before, &${basePaginationButton__next}:after`]:
          {
            content: '',
            blockSize: '100%',
            borderRadius: 'calc(infinity * 1px)',
            inlineSize: '100%',
            insetBlockStart: 0,
            insetInlineStart: 0,
            position: 'absolute',
          },

        [`&${basePaginationButton__prev}:before, &${basePaginationButton__next}:before`]: {
          transition: getTransition([
            {
              property: 'opacity',
            },
          ]),
          zIndex: 2,
          background: `linear-gradient(90deg, ${cssVariables.color.gradation.primary})`,
        },

        [`&${basePaginationButton__prev}:after, &${basePaginationButton__next}:after`]: {
          zIndex: 1,
          background: `linear-gradient(90deg, ${cssVariables.color.gradation.primaryDark})`,
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`&:not(${basePaginationButton__disabled}):hover`]: {
              backgroundColor: cssVariables.color.background.subLight.hex,
              color: cssVariables.color.font.primary.hex,
            },

            [`&${basePaginationButton__prev}:hover:before, &${basePaginationButton__next}:hover:before`]: {
              opacity: 0,
            },
          },
        },
      },
    },
  },
})

export const basePaginationButton_container = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 3,
    },
  },
})

export const basePaginationButton_text = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const basePaginationButton_icon = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      inlineSize: 24,
      backgroundColor: cssVariables.color.background.light.hex,
    },
  },
})

export const basePaginationSeparator = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
})

export const basePaginationSeparator_icon = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      inlineSize: 24,
      backgroundColor: cssVariables.color.background.subDark.hex,
    },
  },
})

export const basePaginationCurrent = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontMediumBold,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBlock: 0,
      marginInline: 0,
      paddingBlock: 0,
      paddingInline: 0,
      borderRadius: 'calc(infinity * 1px)',
      color: cssVariables.color.font.primary.hex,
      backgroundColor: cssVariables.color.background.subLight.hex,
      aspectRatio: '1 / 1',
      inlineSize: 40,
      blockSize: 'auto',
      lineHeight: 1,
    },
  },
})

export const basePaginationCurrent_container = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
    },
  },
})

export const basePaginationCurrent_text = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})
