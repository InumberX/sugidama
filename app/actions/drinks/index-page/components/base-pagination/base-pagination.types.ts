export type BasePaginationProps = {
  currentPage: number
  /** At least 1. */
  totalPage: number
  /** The URL of a page; the pages are plain links. */
  hrefFor: (page: number) => string
  /** The navigation landmark's name. */
  label: string
  prevLabel: string
  nextLabel: string
}

/** One position in the page list, and the widths it is shown at. */
export type PaginationEntry =
  | { kind: 'page'; page: number; narrow: boolean; wide: boolean }
  | { kind: 'gap'; narrow: boolean; wide: boolean }
