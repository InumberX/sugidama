import type { BaseTagProps } from '../../tags/base-tag/base-tag.types.ts'

export type BaseTagListAlign = 'left' | 'center' | 'right'

export type BaseTagListProps = {
  items: BaseTagProps[]
  /**
   * Renders spans instead of `div > ul > li`, for a list that sits inside
   * phrasing content (a link, a heading) where a `ul` is not allowed.
   */
  isNotSemantic?: boolean
  align?: BaseTagListAlign
}
