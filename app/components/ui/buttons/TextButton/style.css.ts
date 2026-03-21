import { style } from '@vanilla-extract/css'

import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontLarge, fontMedium, fontSmall } from '~/styles/variables/font.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const textButton__disabled = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      cursor: 'not-allowed',
      opacity: cssVariables.opacity.disabled,
      pointerEvents: 'none',
    },
  },
})

export const textButton__small = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontSmall,
    },
  },
})

export const textButton__medium = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontMedium,
    },
  },
})

export const textButton__large = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontLarge,
    },
  },
})

export const textButton__sub = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      color: cssVariables.color.font.sub.hex,
    },
  },
})

export const textButton__light = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      color: cssVariables.color.font.light.hex,
    },
  },
})

export const textButton__primary = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      color: cssVariables.color.font.primary.hex,
    },
  },
})

export const textButton__subDark = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      color: cssVariables.color.font.subDark.hex,
    },
  },
})

export const textButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      inlineSize: 'auto',
      blockSize: 'auto',
      marginBlock: 0,
      marginInline: 0,
      paddingBlock: 0,
      paddingInline: 0,
      textDecoration: 'none',
      boxShadow: 'none',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: 0,
      textAlign: 'start',
      transition: getTransition([
        {
          property: 'color',
        },
        {
          property: 'opacity',
        },
      ]),

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              textDecoration: 'underline',
            },
          },
        },
      },
    },
  },
})

export const textButton_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      position: 'relative',
      zIndex: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  },
})

export const textButton_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'block',
    },
  },
})
