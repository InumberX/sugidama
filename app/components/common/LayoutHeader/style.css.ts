import { style } from '@vanilla-extract/css'
import { getClampPx } from '~/styles/mixins/size.css'
import { cssLayerComponentCommon } from '~/styles/variables/layers.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { getMediaQuery, getMediaQueryReverse } from '~/styles/mixins/mediaQuery.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { fontSmallBold } from '~/styles/variables/font.css'
import { getRgba } from '~/styles/mixins/color.css'

export const layoutHeaderHeight = {
  minimum: 56,
  maximum: 80,
}

export const layoutHeader = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      inlineSize: '100%',
      insetBlockStart: 0,
      insetInlineStart: 0,
      position: 'absolute',
      zIndex: cssVariables.zIndex.header.wrapper,
    },
  },
})

export const layoutHeader_wrapper = style({
  '@layer': {
    [cssLayerComponentCommon]: {},
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
      inlineSize: getClampPx(120, 240),
    },
  },
})

export const layoutHeaderMenu = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      zIndex: cssVariables.zIndex.header.menu,

      '@media': {
        [getMediaQuery('sm')]: {
          position: 'fixed',
          insetBlockStart: 8,
          insetInlineEnd: cssVariables.layout.inner.padding.sm,
        },

        [getMediaQuery('md')]: {
          insetInlineEnd: cssVariables.layout.inner.padding.md,
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
          backgroundColor: getRgba(cssVariables.color.background.subLight.rgb, 0.56),
          borderRadius: 'calc(infinity * 1px)',
          WebkitBackdropFilter: 'blur(24px)',
          backdropFilter: 'blur(24px)',
        },
      },
    },
  },
})

export const layoutHeaderMenuGlobal = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      position: 'fixed',
      insetBlockEnd: 16,
      insetInlineStart: cssVariables.layout.inner.padding.xs,
      inlineSize: `calc(100% - ${cssVariables.layout.inner.padding.xs} * 2)`,
      zIndex: cssVariables.zIndex.header.global,

      '@media': {
        [getMediaQuery('sm')]: {
          position: 'static',
          insetBlockEnd: 'auto',
          insetInlineStart: 'auto',
          inlineSize: 'auto',
        },
      },
    },
  },
})

export const layoutHeaderMenuGlobal_container = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      '@media': {
        [getMediaQueryReverse('sm')]: {
          backgroundColor: getRgba(cssVariables.color.background.subLight.rgb, 0.56),
          borderRadius: 'calc(infinity * 1px)',
          WebkitBackdropFilter: 'blur(24px)',
          backdropFilter: 'blur(24px)',
        },
      },
    },
  },
})

export const layoutHeaderMenuGlobal_navigation = style({
  '@layer': {
    [cssLayerComponentCommon]: {},
  },
})

export const layoutHeaderMenuGlobal_items = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'flex',
    },
  },
})

export const layoutHeaderMenuGlobal_item = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      flexGrow: 1,
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
      paddingBlock: 8,
      paddingInline: 16,

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
