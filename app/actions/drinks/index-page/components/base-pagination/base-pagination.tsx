// Ported from develop: app/components/ui/paginations/BasePagination. Only the
// drinks list uses it, so it lives with the page. develop's buttons
// resubmitted the search form from JavaScript; these are links to the same
// search on another page, so they work without it and can be opened in a new
// tab.
import { css, type Handle } from 'remix/component'

import { SvgIcon } from '../../../../../ui/icons/public/svg-icon/svg-icon.tsx'
import type { StyleRecipe } from '../../../../../ui/styles/public/mixins.ts'
import * as styles from './base-pagination.styles.ts'
import type { BasePaginationProps, PaginationEntry } from './base-pagination.types.ts'

export type * from './base-pagination.types.ts'

// develop's BasePagination rendered its page list twice, once per width, and
// hid one of them with utility classes. This computes one list instead, each
// entry marked with the widths it shows at.
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

const visibility = (narrow: boolean, wide: boolean): StyleRecipe | null =>
  narrow && wide
    ? null
    : wide
      ? styles.basePagination_item__wideOnly
      : styles.basePagination_item__narrowOnly

export function BasePagination(handle: Handle<BasePaginationProps>) {
  return () => {
    const { currentPage, totalPage, hrefFor, label, prevLabel, nextLabel } = handle.props

    const step = (page: number, text: string, icon: 'keyboardArrowLeft' | 'keyboardArrowRight') => {
      const enabled = page >= 1 && page <= totalPage
      const content = <SvgIcon variant={icon} styleOverrides={styles.basePaginationLink_icon} />
      const recipe = {
        ...styles.basePaginationLink,
        ...styles.basePaginationLink__step,
        ...(enabled ? null : styles.basePaginationLink__disabled),
      }

      return enabled ? (
        <a href={hrefFor(page)} aria-label={text} title={text} mix={css(recipe)}>
          {content}
        </a>
      ) : (
        <span aria-hidden="true" mix={css(recipe)}>
          {content}
        </span>
      )
    }

    return (
      <nav aria-label={label}>
        <ul mix={css(styles.basePagination_items)}>
          <li mix={css({ ...styles.basePagination_item, ...styles.basePagination_item__prev })}>
            {step(currentPage - 1, prevLabel, 'keyboardArrowLeft')}
          </li>
          {paginationEntries(currentPage, totalPage).map((entry, i) => (
            <li
              key={entry.kind === 'page' ? entry.page : `gap-${i}`}
              mix={css({ ...styles.basePagination_item, ...visibility(entry.narrow, entry.wide) })}
            >
              {entry.kind === 'gap' ? (
                <span mix={css(styles.basePaginationGap)}>
                  <SvgIcon variant="moreHoriz" styleOverrides={styles.basePaginationGap_icon} />
                </span>
              ) : entry.page === currentPage ? (
                <span aria-current="page" mix={css(styles.basePaginationCurrent)}>
                  {entry.page}
                </span>
              ) : (
                <a href={hrefFor(entry.page)} mix={css(styles.basePaginationLink)}>
                  {entry.page}
                </a>
              )}
            </li>
          ))}
          <li mix={css({ ...styles.basePagination_item, ...styles.basePagination_item__next })}>
            {step(currentPage + 1, nextLabel, 'keyboardArrowRight')}
          </li>
        </ul>
      </nav>
    )
  }
}
