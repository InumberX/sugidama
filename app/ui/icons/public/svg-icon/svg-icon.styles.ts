// Ported from develop: app/components/ui/icons/SvgIcon/style.css.ts
//
// The SVG is a mask and the color is the background, so one file serves every
// color. Each mask URL carries the cache buster, as develop's did, through
// staticUrl(): app/env.ts is server-only, and this tier must be importable from
// a hydrated component.
import { staticUrl } from '../../../public/static-url.ts'
import { getTransition, type StyleRecipe } from '../../../styles/public/mixins.ts'
import type { SvgIconVariant } from './svg-icon.types.ts'

export const svgIcon: StyleRecipe = {
  aspectRatio: '1 / 1',
  backgroundColor: 'var(--color-util-black)',
  display: 'inline-flex',
  inlineSize: '24px',
  maskPosition: 'center',
  maskRepeat: 'no-repeat',
  maskSize: 'contain',
  // The prefixed forms too, as develop had them: Chrome before 120 and Safari
  // before 15.4 read only these, and would paint a solid square.
  WebkitMaskPosition: 'center',
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskSize: 'contain',
  transition: getTransition([{ property: 'background-color' }, { property: 'opacity' }]),
}

/** The file for each `variant`: public/static/img/icon-<file>.svg. */
export const svgIconFiles: Record<SvgIconVariant, string> = {
  home: 'home',
  search: 'search',
  mail: 'mail',
  liquor: 'liquor',
  translate: 'translate',
  keyboardArrowDown: 'keyboard-arrow-down',
  keyboardArrowLeft: 'keyboard-arrow-left',
  keyboardArrowRight: 'keyboard-arrow-right',
  keyboardArrowUp: 'keyboard-arrow-up',
  moreHoriz: 'more-horiz',
  error: 'error',
  replay: 'replay',
  check: 'check',
  slash: 'slash',
}

/**
 * The mask for one variant, with the cache buster. A function rather than a
 * recipe per variant, so staticUrl() runs while rendering — after the server
 * has set the query — and not when this module loads.
 */
export const getSvgIconMask = (variant: SvgIconVariant): StyleRecipe => {
  const url = `url(${staticUrl(`/static/img/icon-${svgIconFiles[variant]}.svg`)})`
  return { maskImage: url, WebkitMaskImage: url }
}
