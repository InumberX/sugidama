// Ported from develop: app/components/ui/icons/SvgIcon/style.css.ts
//
// The SVG is a mask and the color is the background, so one file serves every
// color. develop appended the cache buster to each mask URL; the files are
// served from root public/ with ETag revalidation, so a changed icon is picked
// up anyway, and this module could not read `CACHE_BUSTER` (app/env.ts is
// server-only, and this tier must be importable from a hydrated component).
import { getTransition, type StyleRecipe } from '../../styles/public/mixins.ts'
import type { SvgIconVariant } from './svg-icon.types.ts'

export const svgIcon: StyleRecipe = {
  aspectRatio: '1 / 1',
  backgroundColor: 'var(--color-util-black)',
  display: 'inline-flex',
  inlineSize: '24px',
  maskPosition: 'center',
  maskRepeat: 'no-repeat',
  maskSize: 'contain',
  transition: getTransition([{ property: 'background-color' }, { property: 'opacity' }]),
}

const maskOf = (file: string): StyleRecipe => ({
  maskImage: `url(/assets/img/icon-${file}.svg)`,
})

export const svgIcon__home = maskOf('home')
export const svgIcon__search = maskOf('search')
export const svgIcon__mail = maskOf('mail')
export const svgIcon__liquor = maskOf('liquor')
export const svgIcon__translate = maskOf('translate')
export const svgIcon__keyboardArrowDown = maskOf('keyboard-arrow-down')
export const svgIcon__keyboardArrowLeft = maskOf('keyboard-arrow-left')
export const svgIcon__keyboardArrowRight = maskOf('keyboard-arrow-right')
export const svgIcon__keyboardArrowUp = maskOf('keyboard-arrow-up')
export const svgIcon__moreHoriz = maskOf('more-horiz')
export const svgIcon__error = maskOf('error')
export const svgIcon__replay = maskOf('replay')
export const svgIcon__check = maskOf('check')
export const svgIcon__slash = maskOf('slash')

/** Lookup for the `variant` prop; members are the modifier recipes above. */
export const svgIconVariants: Record<SvgIconVariant, StyleRecipe> = {
  home: svgIcon__home,
  search: svgIcon__search,
  mail: svgIcon__mail,
  liquor: svgIcon__liquor,
  translate: svgIcon__translate,
  keyboardArrowDown: svgIcon__keyboardArrowDown,
  keyboardArrowLeft: svgIcon__keyboardArrowLeft,
  keyboardArrowRight: svgIcon__keyboardArrowRight,
  keyboardArrowUp: svgIcon__keyboardArrowUp,
  moreHoriz: svgIcon__moreHoriz,
  error: svgIcon__error,
  replay: svgIcon__replay,
  check: svgIcon__check,
  slash: svgIcon__slash,
}
