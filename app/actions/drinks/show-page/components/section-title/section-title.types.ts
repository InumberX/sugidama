import type { RemixNode } from 'remix/component'

export type SectionTitleTag = 'h2' | 'h3' | 'h4' | 'p' | 'div'

export type SectionTitleProps = {
  title: RemixNode
  /** `h2` by default: a section below the page's `h1`. */
  titleTag?: SectionTitleTag
  id?: string
}
