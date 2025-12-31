import { style } from '@vanilla-extract/css'

import { CACHE_BUSTER } from '~/config/env'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const svgIcon = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'inline-flex',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      inlineSize: 24,
      aspectRatio: '1 / 1',
      backgroundColor: cssVariables.color.util.black.hex,
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      transition: getTransition([
        {
          property: 'background-color',
        },
        {
          property: 'opacity',
        },
      ]),
    },
  },
})

export const svgIcon__home = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: `url(/assets/img/icon-home.svg?${CACHE_BUSTER})`,
      maskImage: `url(/assets/img/icon-home.svg?${CACHE_BUSTER})`,
    },
  },
})

export const svgIcon__search = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: `url(/assets/img/icon-search.svg?${CACHE_BUSTER})`,
      maskImage: `url(/assets/img/icon-search.svg?${CACHE_BUSTER})`,
    },
  },
})

export const svgIcon__mail = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: `url(/assets/img/icon-mail.svg?${CACHE_BUSTER})`,
      maskImage: `url(/assets/img/icon-mail.svg?${CACHE_BUSTER})`,
    },
  },
})

export const svgIcon__liquor = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: `url(/assets/img/icon-liquor.svg?${CACHE_BUSTER})`,
      maskImage: `url(/assets/img/icon-liquor.svg?${CACHE_BUSTER})`,
    },
  },
})

export const svgIcon__translate = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: `url(/assets/img/icon-translate.svg?${CACHE_BUSTER})`,
      maskImage: `url(/assets/img/icon-translate.svg?${CACHE_BUSTER})`,
    },
  },
})

export const svgIcon__keyboardArrowDown = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: `url(/assets/img/icon-keyboard-arrow-down.svg?${CACHE_BUSTER})`,
      maskImage: `url(/assets/img/icon-keyboard-arrow-down.svg?${CACHE_BUSTER})`,
    },
  },
})

export const svgIcon__keyboardArrowLeft = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: `url(/assets/img/icon-keyboard-arrow-left.svg?${CACHE_BUSTER})`,
      maskImage: `url(/assets/img/icon-keyboard-arrow-left.svg?${CACHE_BUSTER})`,
    },
  },
})

export const svgIcon__keyboardArrowRight = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: `url(/assets/img/icon-keyboard-arrow-right.svg?${CACHE_BUSTER})`,
      maskImage: `url(/assets/img/icon-keyboard-arrow-right.svg?${CACHE_BUSTER})`,
    },
  },
})

export const svgIcon__keyboardArrowUp = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: `url(/assets/img/icon-keyboard-arrow-up.svg?${CACHE_BUSTER})`,
      maskImage: `url(/assets/img/icon-keyboard-arrow-up.svg?${CACHE_BUSTER})`,
    },
  },
})

export const svgIcon__moreHoriz = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: `url(/assets/img/icon-more-horiz.svg?${CACHE_BUSTER})`,
      maskImage: `url(/assets/img/icon-more-horiz.svg?${CACHE_BUSTER})`,
    },
  },
})
