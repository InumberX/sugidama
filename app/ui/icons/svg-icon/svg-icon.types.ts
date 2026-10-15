import type { MixInput } from 'remix/component'

import type { StyleRecipe } from '../../styles/public/mixins.ts'

/** One per file in public/assets/img/icon-*.svg. */
export type SvgIconVariant =
  | 'home'
  | 'search'
  | 'mail'
  | 'liquor'
  | 'translate'
  | 'keyboardArrowDown'
  | 'keyboardArrowLeft'
  | 'keyboardArrowRight'
  | 'keyboardArrowUp'
  | 'moreHoriz'
  | 'error'
  | 'replay'
  | 'check'
  | 'slash'

export type SvgIconProps = {
  variant: SvgIconVariant
  /**
   * The icon's accessible name. With one, the icon is announced as an image;
   * without one it is decorative and hidden from assistive technology, which
   * is what an icon beside its own text label wants.
   */
  title?: string
  /** Size and color: `inlineSize` and `backgroundColor` (`currentColor` follows the text). */
  styleOverrides?: StyleRecipe
  mix?: MixInput<HTMLElement>
}
