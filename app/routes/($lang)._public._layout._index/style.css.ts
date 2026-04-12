import { style } from '@vanilla-extract/css'

import { getClampPx } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontLargeBold } from '~/styles/variables/font.css'
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
