import { style } from '@vanilla-extract/css'

import { getContainerQuery, getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontLargeBold, fontMediumBold } from '~/styles/variables/font.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

export const home = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const homeTitle = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const homeTitle_container = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: getClampPx(24, 40),
    },
  },
})

export const homeTitleLogo = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
    },
  },
})

export const homeTitleLogo_image = style({
  '@layer': {
    [cssLayerComponentPage]: {
      inlineSize: '70%',
      blockSize: 'auto',
      maxInlineSize: 480,
    },
  },
})

export const homeTitleLead = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const homeTitleLead_paragraph = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontLargeBold,
      color: cssVariables.color.font.subDark.hex,
    },
  },
})

export const homeNewArrivals = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const homeNewArrivals_container = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: getClampPx(24, 40),
    },
  },
})

export const homeNewArrivalsList = style({
  '@layer': {
    [cssLayerComponentPage]: {
      '@container': {
        [getContainerQuery('md')]: {
          display: 'flex',
        },
      },
    },
  },
})

export const homeNewArrivalsList_main = style({
  '@layer': {
    [cssLayerComponentPage]: {
      containerType: 'inline-size',
      flexGrow: 1,
    },
  },
})

export const homeNewArrivalsList_sub = style({
  '@layer': {
    [cssLayerComponentPage]: {
      flexShrink: 0,
      containerType: 'inline-size',
      marginBlockStart: 24,

      '@container': {
        [getContainerQuery('md')]: {
          inlineSize: '50%',
          marginBlockStart: 0,
          marginInlineStart: 24,
        },

        [getContainerQuery('lg')]: {
          inlineSize: '40%',
        },
      },
    },
  },
})

export const homeNewArrivals_bottom = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
})

export const homeSearchCategory = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const homeSearchCategory_container = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: getClampPx(24, 40),
    },
  },
})

export const homeSearchCategoryList = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const homeSearchCategoryList_items = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: getClampPx(16, 24),
    },
  },
})

export const homeSearchCategoryList_item = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const homeSearchCategoryListLink = style({
  '@layer': {
    [cssLayerComponentPage]: {
      textAlign: 'center',
      ...fontMediumBold,
      color: cssVariables.color.font.subDark.hex,

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              color: cssVariables.color.font.primary.hex,
            },
          },
        },
      },
    },
  },
})

export const homeSearchCategoryListLink_container = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
})

export const homeSearchCategoryListLinkThumbnail = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      aspectRatio: '1 / 1',
      borderRadius: 'calc(infinity * 1px)',
    },
  },
})

export const homeSearchCategoryListLinkThumbnail_image = style({
  '@layer': {
    [cssLayerComponentPage]: {
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
            [`${homeSearchCategoryListLink}:hover &`]: {
              scale: cssVariables.scale.hover,
            },
          },
        },
      },
    },
  },
})

export const homeSearchCategoryListLink_title = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMediumBold,
    },
  },
})

export const homeSearchCategory_bottom = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
})
