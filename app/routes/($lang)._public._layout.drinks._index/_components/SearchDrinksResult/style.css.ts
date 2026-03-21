import { style } from '@vanilla-extract/css'

import { fontLargeBold, fontMedium } from '~/styles/variables/font.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

export const searchDrinksResult = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksResult_wrapper = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksResult_container = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksResult_pagination = style({
  '@layer': {
    [cssLayerComponentPage]: {
      marginBlockStart: 40,
    },
  },
})

export const searchDrinksResultNoResult = style({
  '@layer': {
    [cssLayerComponentPage]: {
      paddingBlock: 40,
    },
  },
})

export const searchDrinksResultNoResult_container = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 16,
    },
  },
})

export const searchDrinksResultNoResult_title = style({
  '@layer': {
    [cssLayerComponentPage]: {
      textAlign: 'center',
      ...fontLargeBold,
    },
  },
})

export const searchDrinksResultNoResult_description = style({
  '@layer': {
    [cssLayerComponentPage]: {
      textAlign: 'center',
      ...fontMedium,
    },
  },
})
