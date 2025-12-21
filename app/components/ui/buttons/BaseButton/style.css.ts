import { style } from '@vanilla-extract/css'

import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontLargeBold, fontMediumBold, fontSmallBold } from '~/styles/variables/font.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const baseButton__disabled = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      cursor: 'not-allowed',
      opacity: cssVariables.opacity.disabled,
      pointerEvents: 'none',
    },
  },
})

export const baseButton__large = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontLargeBold,
      paddingBlock: 16,
      paddingInline: getClampPx(24, 64),
    },
  },
})

export const baseButton__medium = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontMediumBold,
      paddingBlock: 14,
      paddingInline: getClampPx(20, 48),
    },
  },
})

export const baseButton__small = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontSmallBold,
      paddingBlock: 12,
      paddingInline: getClampPx(16, 40),
    },
  },
})

export const baseButton__contained = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      borderBlock: 'none',
      borderInline: 'none',

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

export const baseButton__primary = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      selectors: {
        [`&${baseButton__contained}`]: {
          backgroundColor: 'transparent',
          color: cssVariables.color.font.light.hex,
        },

        [`&${baseButton__contained}:before, &${baseButton__contained}:after`]: {
          content: '',
        },

        [`&${baseButton__contained}:before`]: {
          background: `linear-gradient(90deg, ${cssVariables.color.gradation.primary})`,
        },

        [`&${baseButton__contained}:after`]: {
          background: `linear-gradient(90deg, ${cssVariables.color.gradation.primaryDark})`,
        },
      },
    },
  },
})

export const baseButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      alignItems: 'center',
      blockSize: 'auto',
      borderRadius: 'calc(infinity * 1px)',
      display: 'inline-flex',
      inlineSize: 'auto',
      justifyContent: 'center',
      position: 'relative',
      textAlign: 'start',
      transition: getTransition([
        {
          property: 'opacity',
        },
      ]),
    },
  },
})

export const baseButton_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 3,
    },
  },
})

export const baseButton_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'block',
    },
  },
})
