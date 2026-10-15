// Ported from auba-general-view: app/styles/mixins/{transition,size}.css.ts
import type { css } from 'remix/component'

import { BREAKPOINTS } from './breakpoints.ts'

export const getTransition = (
  transitions: { property: string; speed?: number; delay?: number }[]
): string => {
  return transitions
    .map(({ property, speed = 0.3, delay }) => `${speed}s${delay ? ` ${delay}s` : ''} ${property}`)
    .join(', ')
}

// The same span the breakpoint scale covers, so a fluid size and a media query
// never disagree about where the range starts and ends.
const MIN_VIEWPORT = BREAKPOINTS.xs
const MAX_VIEWPORT = BREAKPOINTS.xxl

/** The root font size `rem` resolves against: the browser default, unchanged by app.css. */
const ROOT_FONT_SIZE = 16

const round = (value: number, digits: number): number => {
  const scale = 10 ** digits
  // `+ 0` turns `-0` into `0`, so a flat clamp prints `0vi`, not `-0vi`.
  return Math.round(value * scale) / scale + 0
}

/**
 * The straight line through (MIN_VIEWPORT, minSize) and (MAX_VIEWPORT,
 * maxSize), in px: `intercept + slope * 100vi`. Both helpers below print it,
 * so they cannot drift apart; only the unit differs. Nothing is rounded to an
 * integer — develop rounded the intercept to whole pixels, which shifted the
 * line enough that `getClampPx(10, 11)` reached its maximum at about 1000px
 * instead of 1400px.
 */
const getFluidLine = (minSize: number, maxSize: number) => {
  const slope = (maxSize - minSize) / (MAX_VIEWPORT - MIN_VIEWPORT)
  return { slope, intercept: minSize - slope * MIN_VIEWPORT }
}

/**
 * Fluid size between the two viewport widths, in px. `minSize` is the size at
 * the narrow end and `maxSize` at the wide end; a size that shrinks on wide
 * screens passes them descending, and the clamp bounds are ordered so CSS
 * does not pin it to the first one.
 */
export const getClampPx = (minSize: number, maxSize: number): string => {
  const { slope, intercept } = getFluidLine(minSize, maxSize)
  const [lower, upper] = [Math.min(minSize, maxSize), Math.max(minSize, maxSize)]
  return `clamp(${lower}px, ${round(intercept, 3)}px + ${round(slope * 100, 4)}vi, ${upper}px)`
}

/**
 * Fluid size between the two viewport widths, in rem — the same line as
 * `getClampPx`, divided by the 16px root, so it scales with the user's font
 * size setting. (develop's comment said "at a 62.5% root"; the arithmetic was
 * always `/ 16`, and app.css does not change the root size.)
 */
export const getClampRem = (minSize: number, maxSize: number): string => {
  const { slope, intercept } = getFluidLine(minSize, maxSize)
  const rem = (px: number) => round(px / ROOT_FONT_SIZE, 4)
  const [lower, upper] = [Math.min(minSize, maxSize), Math.max(minSize, maxSize)]
  return `clamp(${rem(lower)}rem, ${rem(intercept)}rem + ${round(slope * 100, 4)}vi, ${rem(upper)}rem)`
}

/** A fixed px size in rem against the 16px root (develop's `getFontSize`). */
export const getFontSize = (size: number): string => `${round(size / ROOT_FONT_SIZE, 4)}rem`

/**
 * Truncates to `maxLine` lines with an ellipsis. `-webkit-line-clamp` is the
 * only cross-browser way to do this; the `-webkit-box` display is required.
 */
export const getLineClamp = (maxLine: number): StyleRecipe => {
  return {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    WebkitLineClamp: maxLine,
  }
}

/**
 * Style recipes are plain `CSSProps` objects, never `css(...)` descriptors, so
 * consumers can spread them into a single `css(...)` call. Two separate
 * descriptors on one element do NOT have a reliable cascade order — see the
 * "Override styles by spreading recipes into one `css(...)` call" rule in
 * CLAUDE.md.
 */
export type StyleRecipe = Parameters<typeof css>[0]
