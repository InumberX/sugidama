import { style } from '@vanilla-extract/css'

import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const articleSlider = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleSlider_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 1fr)',
      gap: 16,
    },
  },
})

export const articleSliderMain__active = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleSliderMain = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      minInlineSize: 1,
      opacity: 0,

      selectors: {
        [`&${articleSliderMain__active}`]: {
          opacity: 1,
        },
      },
    },
  },
})

export const articleSliderMain_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleSliderMain_slider = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleSliderMain_slide = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleSliderMainImage = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      inlineSize: '100%',
      blockSize: '100%',
    },
  },
})

export const articleSliderMainImage_image = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      inlineSize: '100%',
      blockSize: 'auto',
    },
  },
})

export const articleSliderSub__active = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleSliderSub = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      minInlineSize: 1,
      opacity: 0,

      selectors: {
        [`&${articleSliderSub__active}`]: {
          opacity: 1,
        },
      },
    },
  },
})

export const articleSliderSub_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      gridTemplateRows: 'auto',
      gap: 16,
    },
  },
})

export const articleSliderSubButton__prev = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridColumn: '1 / 2',
      gridRow: '1 / 2',
    },
  },
})

export const articleSliderSubButton__next = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      gridColumn: '3 / 4',
      gridRow: '1 / 2',
    },
  },
})

export const articleSliderSubButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
})

export const articleSliderSubButton_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
})

export const articleSliderSubButton_button__disabled = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      cursor: 'not-allowed',
      opacity: cssVariables.opacity.disabled,
      pointerEvents: 'none',
    },
  },
})

export const articleSliderSubButton_button__prev = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleSliderSubButton_button__next = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleSliderSubButton_button = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleSliderSub_slider = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      position: 'relative',
      gridColumn: '2 / 3',
      gridRow: '1 / 2',
    },
  },
})

export const articleSliderSub_slide = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleSliderSubImage__current = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const articleSliderSubImage = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      inlineSize: '100%',
      blockSize: 'auto',
      overflow: 'hidden',
      borderRadius: 4,
      position: 'relative',
      paddingBlock: 2,
      paddingInline: 2,
      backgroundColor: 'transparent',
      border: 'none',

      selectors: {
        '&::after': {
          content: '',
          display: 'block',
          inlineSize: '100%',
          blockSize: '100%',
          background: `linear-gradient(90deg, ${cssVariables.color.gradation.primary})`,
          position: 'absolute',
          zIndex: 1,
          insetBlockStart: 0,
          insetInlineStart: 0,
          opacity: 0,
          transition: getTransition([
            {
              property: 'opacity',
            },
          ]),
        },

        [`&${articleSliderSubImage__current}::after`]: {
          opacity: 1,
        },
      },
    },
  },
})

export const articleSliderSubImage_contents = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      inlineSize: '100%',
      blockSize: 'auto',
      aspectRatio: '16 / 9',
      overflow: 'hidden',
      borderRadius: 4,
      position: 'relative',
      zIndex: 2,
    },
  },
})

export const articleSliderSubImage_image = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      inlineSize: '100%',
      blockSize: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      transition: getTransition([
        {
          property: 'scale',
        },
      ]),

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`${articleSliderSubImage}:hover &`]: {
              scale: cssVariables.scale.hover,
            },
          },
        },
      },
    },
  },
})
