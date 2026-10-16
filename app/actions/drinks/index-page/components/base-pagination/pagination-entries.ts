// develop's BasePagination rendered its page list twice, once per width, and
// hid one of them with utility classes. This computes one list instead, each
// entry marked with the widths it shows at.
import type { PaginationEntry } from './base-pagination.types.ts'

type Width = 'narrow' | 'wide'

type Window = {
  /** Up to this many pages, every page is listed. */
  showAllUpTo: number
  /** Pages listed either side of the current one. */
  around: number
}

const WINDOWS: Record<Width, Window> = {
  // Below md: the first, the current and the last page.
  narrow: { showAllUpTo: 3, around: 0 },
  // md and up: the first, the current with one either side, and the last.
  wide: { showAllUpTo: 5, around: 1 },
}

const listedPages = (current: number, total: number, { showAllUpTo, around }: Window) => {
  const pages: number[] = []
  for (let page = 1; page <= total; page++) {
    if (
      total <= showAllUpTo ||
      page === 1 ||
      page === total ||
      Math.abs(page - current) <= around
    ) {
      pages.push(page)
    }
  }
  return pages
}

export const paginationEntries = (current: number, total: number): PaginationEntry[] => {
  const shown = new Map<number, Set<Width>>()
  const gapAfter = new Map<number, Set<Width>>()

  for (const width of ['narrow', 'wide'] as const) {
    const pages = listedPages(current, total, WINDOWS[width])
    pages.forEach((page, i) => {
      shown.set(page, (shown.get(page) ?? new Set()).add(width))
      // A gap follows a page when the next page listed at this width is not
      // the next number.
      const next = pages[i + 1]
      if (next !== undefined && next - page > 1) {
        gapAfter.set(page, (gapAfter.get(page) ?? new Set()).add(width))
      }
    })
  }

  return [...shown.keys()]
    .sort((a, b) => a - b)
    .flatMap((page): PaginationEntry[] => {
      const widths = shown.get(page)!
      const gap = gapAfter.get(page)
      const entry: PaginationEntry = {
        kind: 'page',
        page,
        narrow: widths.has('narrow'),
        wide: widths.has('wide'),
      }
      return gap
        ? [entry, { kind: 'gap', narrow: gap.has('narrow'), wide: gap.has('wide') }]
        : [entry]
    })
}
