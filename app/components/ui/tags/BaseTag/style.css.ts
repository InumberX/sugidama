import { style } from '@vanilla-extract/css'

import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontCaption } from '~/styles/variables/font.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const baseTag__disabled = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      cursor: 'not-allowed',
      opacity: cssVariables.opacity.disabled,
      pointerEvents: 'none',
    },
  },
})

export const baseTag__button = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const baseTag__contained = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const baseTag__outlined = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const baseTag__sub = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      selectors: {
        [`&${baseTag__contained}`]: {
          backgroundColor: cssVariables.color.background.subDark.hex,
          color: cssVariables.color.font.light.hex,
          borderColor: cssVariables.color.border.subDark.hex,
        },

        [`&${baseTag__outlined}`]: {
          backgroundColor: 'transparent',
          color: cssVariables.color.font.subDark.hex,
          borderColor: cssVariables.color.border.subDark.hex,
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`&${baseTag__button}${baseTag__contained}:hover`]: {
              backgroundColor: cssVariables.color.background.light.hex,
              color: cssVariables.color.font.subDark.hex,
            },

            [`&${baseTag__button}${baseTag__outlined}:hover`]: {
              backgroundColor: cssVariables.color.background.subDark.hex,
              color: cssVariables.color.font.light.hex,
            },
          },
        },
      },
    },
  },
})

export const baseTag = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontCaption,
      alignItems: 'center',
      blockSize: 'auto',
      display: 'inline-flex',
      inlineSize: 'auto',
      justifyContent: 'center',
      marginBlock: 0,
      marginInline: 0,
      paddingBlock: 4,
      paddingInline: 8,
      position: 'relative',
      textAlign: 'start',
      textDecoration: 'none',
      boxShadow: 'none',
      borderRadius: 'calc(infinity * 1px)',
      borderBlock: '1px solid',
      borderInline: '1px solid',
      transition: getTransition([
        {
          property: 'color',
        },
        {
          property: 'opacity',
        },
        {
          property: 'background-color',
        },
        {
          property: 'border-color',
        },
      ]),
    },
  },
})

export const baseTag_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
    },
  },
})

export const baseTag_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'block',
    },
  },
})
