import { type StyleRule } from '@vanilla-extract/css'

export const getRgba = (color: string, alpha: number) => {
  return `rgba(${color}, ${alpha})`
}

export const getTextGradation = (color: string): StyleRule => {
  return {
    background: color,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }
}
