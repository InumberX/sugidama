import { style } from '@vanilla-extract/css'

import { getContainerQuery } from '~/styles/mixins/mediaQuery.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontSmall, fontCaption } from '~/styles/variables/font.css'
import { cssLayerComponentUiLow, cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const baseAlert__contained = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const baseAlert__success = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      selectors: {
        [`&${baseAlert__contained}`]: {
          backgroundColor: cssVariables.color.background.successLight.hex,
        },
      },
    },
  },
})

export const baseAlert__error = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      selectors: {
        [`&${baseAlert__contained}`]: {
          backgroundColor: cssVariables.color.background.errorLight.hex,
        },
      },
    },
  },
})

export const baseAlert = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      paddingBlock: getClampPx(8, 16),
      paddingInline: getClampPx(8, 16),
      borderRadius: getClampPx(4, 8),
    },
  },
})

export const baseAlert_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'grid',
      alignItems: 'flex-start',
      gridTemplateColumns: 'auto 1fr',
      gridTemplateRows: 'auto auto',
      gridTemplateAreas: `
        "icon title"
        "description description"
      `,

      '@container': {
        [getContainerQuery('sm')]: {
          gridTemplateAreas: `
            "icon title"
            "icon description"
          `,
        },
      },
    },
  },
})

export const baseAlertIcon = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'flex',
      gridArea: 'icon',
    },
  },
})

export const baseAlertIcon_icon = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      inlineSize: 24,

      selectors: {
        [`${baseAlert__success} &`]: {
          backgroundColor: cssVariables.color.background.success.hex,
        },

        [`${baseAlert__error} &`]: {
          backgroundColor: cssVariables.color.background.error.hex,
        },
      },
    },
  },
})

export const baseAlert_title = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontSmall,
      color: cssVariables.color.font.base.hex,
      gridArea: 'title',
      marginBlockStart: getClampPx(2, 3),
      marginInlineStart: getClampPx(8, 16),
    },
  },
})

export const baseAlert_description = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontCaption,
      color: cssVariables.color.font.subDark.hex,
      gridArea: 'description',
      marginBlockStart: getClampPx(4, 8),

      '@container': {
        [getContainerQuery('sm')]: {
          marginInlineStart: getClampPx(8, 16),
        },
      },
    },
  },
})
