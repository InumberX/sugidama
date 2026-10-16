// Ported from develop: SearchDrinksResult. Server-rendered: the results come
// with the page, so there is no loading state (develop streamed them and showed
// a skeleton meanwhile).
import { css, type Handle } from 'remix/component'

import { ArticleCardList } from '../../../../../ui/lists/article-card-list/article-card-list.tsx'
import { ReplaceNewLineText } from '../../../../../ui/typographies/replace-new-line-text/replace-new-line-text.tsx'
import { DRINKS_PAGE_SIZE } from '../../../../../utils/drink-search.ts'
import type { DrinkSearchResult } from '../../index-page.data.ts'
import { BaseAlert } from '../base-alert/base-alert.tsx'
import { BasePagination } from '../base-pagination/base-pagination.tsx'
import * as styles from './search-drinks-result.styles.ts'

/** The fragment pagination links point at. */
export const SEARCH_DRINKS_RESULT_ID = 'search-drinks-result'

export type SearchDrinksResultMessages = {
  noResultTitle: string
  noResultDescription: string
  errorTitle: string
  errorMessageTitle: string
  paginationLabel: string
  prevPage: string
  nextPage: string
}

export type SearchDrinksResultProps = {
  result: DrinkSearchResult
  currentPage: number
  /** A page of the same search, for the pagination links. */
  hrefFor: (page: number) => string
  messages: SearchDrinksResultMessages
}

export function SearchDrinksResult(handle: Handle<SearchDrinksResultProps>) {
  return () => {
    const { result, currentPage, hrefFor, messages } = handle.props

    // The id is on every branch: pagination links point at it, and a page
    // whose search failed is still reached through one.
    if (!result.success) {
      return (
        <div id={SEARCH_DRINKS_RESULT_ID}>
          <BaseAlert
            color="error"
            title={messages.errorTitle}
            description={`${messages.errorMessageTitle}${result.message}`}
          />
        </div>
      )
    }

    return (
      <div id={SEARCH_DRINKS_RESULT_ID} mix={css(styles.searchDrinksResult)}>
        {result.cards.length > 0 ? (
          <>
            <ArticleCardList items={result.cards} />
            <div mix={css(styles.searchDrinksResult_pagination)}>
              <BasePagination
                currentPage={currentPage}
                totalSize={result.totalSize}
                perPageSize={DRINKS_PAGE_SIZE}
                hrefFor={(page) => `${hrefFor(page)}#${SEARCH_DRINKS_RESULT_ID}`}
                label={messages.paginationLabel}
                prevLabel={messages.prevPage}
                nextLabel={messages.nextPage}
              />
            </div>
          </>
        ) : (
          <div mix={css(styles.searchDrinksResultNoResult)}>
            <p mix={css(styles.searchDrinksResultNoResult_title)}>{messages.noResultTitle}</p>
            <p mix={css(styles.searchDrinksResultNoResult_description)}>
              <ReplaceNewLineText text={messages.noResultDescription} />
            </p>
          </div>
        )}
      </div>
    )
  }
}
