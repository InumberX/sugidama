import { style } from '@vanilla-extract/css'

import { getMediaQuery, getMediaQueryReverse } from '~/styles/mixins/mediaQuery.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontSmallBold } from '~/styles/variables/font.css'
import { cssLayerComponentCommon } from '~/styles/variables/layers.css'

export const layoutHeaderHeight = {
  minimum: 64,
  maximum: 64,
}

export const layoutHeader = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      inlineSize: '100%',
      insetBlockStart: 0,
      insetInlineStart: 0,
      position: 'absolute',
      zIndex: cssVariables.zIndex.header.wrapper,
      paddingBlockStart: 16,
      paddingInline: 16,

      '@media': {
        [getMediaQuery('sm')]: {
          position: 'fixed',
          backgroundColor: cssVariables.color.background.subLight.hex,
          paddingBlockStart: 0,
          paddingInline: 0,
        },
      },
    },
  },
})

export const layoutHeaderBar__top = style({
  '@layer': {
    [cssLayerComponentCommon]: {},
  },
})

export const layoutHeaderBar__bottom = style({
  '@layer': {
    [cssLayerComponentCommon]: {},
  },
})

export const layoutHeaderBar = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      position: 'fixed',
      zIndex: cssVariables.zIndex.header.bar,
      display: 'block',
      backgroundColor: cssVariables.color.background.subLight.hex,

      selectors: {
        [`&${layoutHeaderBar__top}, &${layoutHeaderBar__bottom}`]: {
          inlineSize: '100%',
          blockSize: 16,
        },

        [`&${layoutHeaderBar__top}`]: {
          insetBlockStart: 0,
          insetInlineStart: 0,
        },

        [`&${layoutHeaderBar__bottom}`]: {
          display: 'none',
          insetBlockEnd: getClampPx(layoutHeaderHeight.minimum, layoutHeaderHeight.maximum),
          insetInlineStart: 0,
        },
      },

      '@media': {
        [getMediaQuery('sm')]: {
          selectors: {
            [`&${layoutHeaderBar__top}`]: {
              display: 'none',
            },

            [`&${layoutHeaderBar__bottom}`]: {
              display: 'block',
              insetBlockEnd: 0,
            },
          },
        },
      },
    },
  },
})

export const layoutHeader_wrapper = style({
  '@layer': {
    [cssLayerComponentCommon]: {},
  },
})

export const layoutHeader_inner = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      maxInlineSize: `calc(${cssVariables.layout.inner.maxWidth.large} + (16px * 2))`,

      '@media': {
        [getMediaQuery('sm')]: {
          paddingInline: 16,
        },
      },
    },
  },
})

export const layoutHeader_container = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      blockSize: getClampPx(layoutHeaderHeight.minimum, layoutHeaderHeight.maximum),
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: getClampPx(16, 24),
    },
  },
})

export const layoutHeaderLogo = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      blockSize: '100%',
    },
  },
})

export const layoutHeaderLogo_title = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      blockSize: '100%',
    },
  },
})

export const layoutHeaderLogo_link = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      alignItems: 'center',
      blockSize: '100%',
      display: 'flex',
      textDecoration: 'none',
      transition: getTransition([
        {
          property: 'opacity',
        },
      ]),

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              opacity: cssVariables.opacity.hover,
            },
          },
        },
      },
    },
  },
})

export const layoutHeaderLogo_image = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      blockSize: 'auto',
      inlineSize: getClampPx(120, 160),
    },
  },
})

export const layoutHeaderMenu = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      '@media': {
        [getMediaQuery('sm')]: {
          blockSize: '100%',
        },
      },
    },
  },
})

export const layoutHeaderMenu_container = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      '@media': {
        [getMediaQuery('sm')]: {
          blockSize: '100%',
        },
      },
    },
  },
})

export const layoutHeaderMenuGlobal = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      position: 'fixed',
      insetBlockEnd: 0,
      insetInlineStart: 0,
      inlineSize: '100%',
      zIndex: cssVariables.zIndex.header.global,
      blockSize: getClampPx(layoutHeaderHeight.minimum, layoutHeaderHeight.maximum),
      paddingInline: 16,

      '@media': {
        [getMediaQuery('sm')]: {
          position: 'static',
          insetBlockEnd: 'auto',
          insetInlineStart: 'auto',
          inlineSize: 'auto',
          blockSize: '100%',
          paddingInline: 0,
        },
      },
    },
  },
})

export const layoutHeaderMenuGlobal_container = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      blockSize: '100%',

      '@media': {
        [getMediaQueryReverse('sm')]: {
          backgroundColor: cssVariables.color.background.subLight.hex,
        },
      },
    },
  },
})

export const layoutHeaderMenuGlobal_navigation = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      blockSize: '100%',

      '@media': {
        [getMediaQuery('sm')]: {
          display: 'flex',
          justifyContent: 'flex-end',
        },
      },
    },
  },
})

export const layoutHeaderMenuGlobal_items = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'flex',
      blockSize: '100%',
    },
  },
})

export const layoutHeaderMenuGlobal_item = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      flexGrow: 1,
      blockSize: '100%',
    },
  },
})

export const layoutHeaderMenuGlobal_link = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 2,
      ...fontSmallBold,
      color: cssVariables.color.font.base.hex,
      textDecoration: 'none',
      paddingBlock: 4,
      paddingInline: 16,
      blockSize: '100%',

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              color: cssVariables.color.font.primary.hex,
            },
          },
        },

        [getMediaQuery('sm')]: {
          paddingInline: 20,
          flexDirection: 'row',
          gap: 8,
        },

        [getMediaQuery('md')]: {
          paddingInline: 26,
        },

        [getMediaQuery('lg')]: {
          paddingInline: 32,
        },

        [getMediaQuery('xl')]: {
          paddingInline: 36,
        },

        [getMediaQuery('xxl')]: {
          paddingInline: 40,
        },
      },
    },
  },
})

export const layoutHeaderMenuGlobal_icon = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      backgroundColor: cssVariables.color.font.base.hex,
      inlineSize: getClampPx(20, 24),

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`${layoutHeaderMenuGlobal_link}:hover &`]: {
              backgroundColor: cssVariables.color.font.primary.hex,
            },
          },
        },
      },
    },
  },
})

export const layoutHeaderMenuGlobal_text = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'block',
    },
  },
})
