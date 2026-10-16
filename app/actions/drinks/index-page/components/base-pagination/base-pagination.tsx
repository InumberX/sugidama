// Ported from develop: app/components/ui/paginations/BasePagination. Only the
// drinks list uses it, so it lives with the page. develop's buttons
// resubmitted the search form from JavaScript; these are links to the same
// search on another page, so they work without it and can be opened in a new
// tab.
import { css, type Handle } from 'remix/component'

import { SvgIcon } from '../../../../../ui/icons/public/svg-icon/svg-icon.tsx'
import type { StyleRecipe } from '../../../../../ui/styles/public/mixins.ts'
import * as styles from './base-pagination.styles.ts'
import type { BasePaginationProps } from './base-pagination.types.ts'
import { paginationEntries } from './pagination-entries.ts'

export type * from './base-pagination.types.ts'

const visibility = (narrow: boolean, wide: boolean): StyleRecipe | null =>
  narrow && wide
    ? null
    : wide
      ? styles.basePagination_item__wideOnly
      : styles.basePagination_item__narrowOnly

export function BasePagination(handle: Handle<BasePaginationProps>) {
  return () => {
    const { currentPage, totalSize, perPageSize, hrefFor, label, prevLabel, nextLabel } =
      handle.props
    const totalPage = Math.max(1, Math.ceil(totalSize / perPageSize))

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
