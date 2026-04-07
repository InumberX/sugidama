import { style } from '@vanilla-extract/css'

import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const svgIconCircleButton__disabled = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      cursor: 'not-allowed',
      opacity: cssVariables.opacity.disabled,
      pointerEvents: 'none',
    },
  },
})

export const svgIconCircleButton__small = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const svgIconCircleButton__medium = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const svgIconCircleButton__large = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const svgIconCircleButton__contained = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover:before': {
              opacity: 0,
            },
          },
        },
      },
    },
  },
})

export const svgIconCircleButton__primary = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      selectors: {
        [`&${svgIconCircleButton__contained}`]: {
          backgroundColor: 'transparent',
        },

        [`&${svgIconCircleButton__contained}:before, &${svgIconCircleButton__contained}:after`]: {
          content: '',
        },

        [`&${svgIconCircleButton__contained}:before`]: {
          background: `linear-gradient(90deg, ${cssVariables.color.gradation.primary})`,
        },

        [`&${svgIconCircleButton__contained}:after`]: {
          background: `linear-gradient(90deg, ${cssVariables.color.gradation.primaryDark})`,
        },
      },
    },
  },
})

export const svgIconCircleButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      position: 'relative',
      aspectRatio: '1 / 1',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      inlineSize: 'auto',
      blockSize: 'auto',
      overflow: 'hidden',
      borderRadius: 'calc(infinity * 1px)',
      textAlign: 'start',

      selectors: {
        '&:before, &:after': {
          blockSize: '100%',
          borderRadius: 'calc(infinity * 1px)',
          inlineSize: '100%',
          insetBlockStart: 0,
          insetInlineStart: 0,
          position: 'absolute',
        },

        '&:before': {
          transition: getTransition([
            {
              property: 'opacity',
            },
          ]),
          zIndex: 2,
        },

        '&:after': {
          zIndex: 1,
        },
      },
    },
  },
})

export const svgIconCircleButton_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 3,
    },
  },
})

export const svgIconCircleButton_icon = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      selectors: {
        [`${svgIconCircleButton__small} &`]: {
          inlineSize: 24,
        },

        [`${svgIconCircleButton__medium} &`]: {
          inlineSize: 32,
        },

        [`${svgIconCircleButton__large} &`]: {
          inlineSize: 40,
        },

        [`${svgIconCircleButton}${svgIconCircleButton__contained}${svgIconCircleButton__primary} &`]: {
          backgroundColor: cssVariables.color.background.light.hex,
        },
      },
    },
  },
})
