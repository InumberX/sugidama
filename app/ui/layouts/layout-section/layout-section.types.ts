import type { MixInput, RemixNode } from 'remix/component'

import type { StyleRecipe } from '../../styles/public/mixins.ts'

export type LayoutSectionTag = 'section' | 'div' | 'article' | 'aside'
export type LayoutSectionSpace = 'none' | 'small' | 'medium'

export type LayoutSectionProps = {
  children?: RemixNode
  tag?: LayoutSectionTag
  /** Padding above the section. Defaults to `medium`. */
  topSpace?: LayoutSectionSpace
  /** Padding below the section. Defaults to `medium`. */
  bottomSpace?: LayoutSectionSpace
  styleOverrides?: StyleRecipe
  mix?: MixInput<HTMLElement>
}
