import { type StyleRule } from '@vanilla-extract/css'

export const getFontSize = (fontSize: number) => {
  return `${(fontSize / 16) * 1}rem`
}

export const getLineClamp = (
  // Maximum number of Lines
  maxLine: number
): StyleRule => {
  return {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    WebkitLineClamp: maxLine,
  }
}
