import type { RemixNode } from 'remix/component'

import type { LayoutInnerProps } from '../../layouts/layout-inner/layout-inner.types.ts'

export type PageTitleColor = 'dark' | 'primary'
export type PageTitleTag = 'h1' | 'h2' | 'h3' | 'p' | 'div'

export type PageTitleProps = {
  title: RemixNode
  /** `h1` by default: a page has exactly one title. */
  titleTag?: PageTitleTag
  /** `primary` fills the text with the brand gradient. */
  color?: PageTitleColor
  /** Adds the vertical padding and a `LayoutInner`, for a title outside the page's own inner. */
  isWrap?: boolean
  innerProps?: Omit<LayoutInnerProps, 'children'>
}
