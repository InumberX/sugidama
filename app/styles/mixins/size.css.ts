import { BREAKPOINTS } from '~/styles/variables/breakpoints.css'

type ClampOptions = {
  minViewport?: number
  maxViewport?: number
}

const defaultOptions: {
  minViewport: number
  maxViewport: number
} = {
  minViewport: BREAKPOINTS.xs,
  maxViewport: BREAKPOINTS.xxl,
}

export const getClampPx = (minSize: number, maxSize: number, options: ClampOptions = defaultOptions): string => {
  const minViewport = options.minViewport ?? defaultOptions.minViewport
  const maxViewport = options.maxViewport ?? defaultOptions.maxViewport

  const sizeRate = maxSize - minSize
  const viewportRate = maxViewport - minViewport
  const changingSize = Math.round((sizeRate / viewportRate) * 10000) / 100
  const fixedSize = Math.round(minSize - (sizeRate / viewportRate) * minViewport)

  return `clamp(${minSize}px, ${fixedSize}px + ${changingSize}vi, ${maxSize}px)`
}

export const getClampRem = (minSize: number, maxSize: number, options: ClampOptions = defaultOptions): string => {
  const minViewport = options.minViewport ?? defaultOptions.minViewport
  const maxViewport = options.maxViewport ?? defaultOptions.maxViewport

  const sizeRate = maxSize - minSize
  const viewportRate = maxViewport - minViewport
  const changingSize = Math.round((sizeRate / viewportRate) * 10000) / 100
  const fixedSize = Math.round((minSize - (sizeRate / viewportRate) * minViewport) * 62.5) / 1000
  const minRemSize = Math.round(minSize * 62.5) / 1000
  const maxRemSize = Math.round(maxSize * 62.5) / 1000

  return `clamp(${minRemSize}rem, ${fixedSize}rem + ${changingSize}vi, ${maxRemSize}rem)`
}
