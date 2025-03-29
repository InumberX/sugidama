import { style } from '@vanilla-extract/css'
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
      WebkitMaskImage: 'url(/assets/img/icon-home.svg)',
      maskImage: 'url(/assets/img/icon-home.svg)',
    },
  },
})

export const svgIcon__search = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: 'url(/assets/img/icon-search.svg)',
      maskImage: 'url(/assets/img/icon-search.svg)',
    },
  },
})

export const svgIcon__mail = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: 'url(/assets/img/icon-mail.svg)',
      maskImage: 'url(/assets/img/icon-mail.svg)',
    },
  },
})

export const svgIcon__liquor = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: 'url(/assets/img/icon-liquor.svg)',
      maskImage: 'url(/assets/img/icon-liquor.svg)',
    },
  },
})

export const svgIcon__translate = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: 'url(/assets/img/icon-translate.svg)',
      maskImage: 'url(/assets/img/icon-translate.svg)',
    },
  },
})

export const svgIcon__keyboardArrowDown = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: 'url(/assets/img/icon-keyboard-arrow-down.svg)',
      maskImage: 'url(/assets/img/icon-keyboard-arrow-down.svg)',
    },
  },
})

export const svgIcon__keyboardArrowLeft = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: 'url(/assets/img/icon-keyboard-arrow-left.svg)',
      maskImage: 'url(/assets/img/icon-keyboard-arrow-left.svg)',
    },
  },
})

export const svgIcon__keyboardArrowRight = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: 'url(/assets/img/icon-keyboard-arrow-right.svg)',
      maskImage: 'url(/assets/img/icon-keyboard-arrow-right.svg)',
    },
  },
})

export const svgIcon__keyboardArrowUp = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: 'url(/assets/img/icon-keyboard-arrow-up.svg)',
      maskImage: 'url(/assets/img/icon-keyboard-arrow-up.svg)',
    },
  },
})
