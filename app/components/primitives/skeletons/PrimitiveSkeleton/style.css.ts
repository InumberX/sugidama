import { keyframes, style } from '@vanilla-extract/css'

import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentUiPrimitive } from '~/styles/variables/layers.css'

export const primitiveSkeleton__auto = style({
  '@layer': {
    [cssLayerComponentUiPrimitive]: {},
  },
})

export const primitiveSkeleton__rectangle = style({
  '@layer': {
    [cssLayerComponentUiPrimitive]: {},
  },
})

export const primitiveSkeleton__square = style({
  '@layer': {
    [cssLayerComponentUiPrimitive]: {},
  },
})

export const primitiveSkeleton__circle = style({
  '@layer': {
    [cssLayerComponentUiPrimitive]: {},
  },
})

export const primitiveSkeleton__bar = style({
  '@layer': {
    [cssLayerComponentUiPrimitive]: {},
  },
})

export const primitiveSkeleton__sub = style({
  '@layer': {
    [cssLayerComponentUiPrimitive]: {},
  },
})

const keyframesPrimitiveSkeleton = keyframes({
  '0%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0.4,
  },
  '100%': {
    opacity: 1,
  },
})

export const primitiveSkeleton = style({
  '@layer': {
    [cssLayerComponentUiPrimitive]: {
      display: 'block',
      inlineSize: '100%',
      borderRadius: 4,
      animationName: keyframesPrimitiveSkeleton,
      animationDelay: '0.5s',
      animationDuration: '2s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'ease-in-out',

      selectors: {
        [`&${primitiveSkeleton__auto}`]: {
          blockSize: '100%',
        },

        [`&${primitiveSkeleton__rectangle}`]: {
          aspectRatio: '16 / 9',
        },

        [`&${primitiveSkeleton__square}`]: {
          aspectRatio: '1 / 1',
        },

        [`&${primitiveSkeleton__circle}`]: {
          aspectRatio: '1 / 1',
          borderRadius: 'calc(infinity * 1px)',
        },

        [`&${primitiveSkeleton__bar}`]: {
          blockSize: 20,
        },

        [`&${primitiveSkeleton__sub}`]: {
          backgroundColor: cssVariables.color.skeleton.sub.hex,
        },
      },
    },
  },
})
