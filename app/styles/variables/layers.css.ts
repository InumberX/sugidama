import { globalLayer } from '@vanilla-extract/css'

export const cssLayerUtils = globalLayer('utils')

export const cssLayerComponentPage = globalLayer(
  {
    parent: cssLayerUtils,
  },
  'componentPage'
)

export const cssLayerComponentCommon = globalLayer(
  {
    parent: cssLayerComponentPage,
  },
  'componentCommon'
)

export const cssLayerComponentUiHigh = globalLayer(
  {
    parent: cssLayerComponentCommon,
  },
  'componentUiHigh'
)

export const cssLayerComponentUiMiddle = globalLayer(
  {
    parent: cssLayerComponentUiHigh,
  },
  'componentUiMiddle'
)

export const cssLayerComponentUiLow = globalLayer(
  {
    parent: cssLayerComponentUiMiddle,
  },
  'componentUiLow'
)

export const cssLayerReset = globalLayer(
  {
    parent: cssLayerComponentUiLow,
  },
  'reset'
)
