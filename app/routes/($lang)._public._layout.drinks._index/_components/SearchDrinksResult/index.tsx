import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Await } from 'react-router'

import * as styles from './style.css'

import { BaseAlert } from '~/components/ui/alerts/BaseAlert'
import { ArticleCardList, type ArticleCardListProps } from '~/components/ui/lists/ArticleCardList'
import { BasePagination, type BasePaginationProps } from '~/components/ui/paginations/BasePagination'
import { ArticleCardListSkeleton } from '~/components/ui/skeletons/ArticleCardListSkeleton'
import { ReplaceNewLineText } from '~/components/ui/typographies/ReplaceNewLineText/index'
import { DRINKS_PAGE_SIZE } from '~/config/consts'
import { usePaginationScroll } from '~/hooks/usePaginationScroll'

export type SearchDrinksResultData = {
  success: boolean
  error?: string
  drinks: ArticleCardListProps['items']
  totalSize: number
}

type SearchDrinksResultProps = {
  lang: string
  isLoading?: boolean
  currentPage: number
  searchResult: Promise<SearchDrinksResultData>
  handleChangePage: BasePaginationProps['handleChangePage']
}

const ELEMENT_SEARCH_DRINKS_RESULT_ID = 'search-drinks-result'

export const SearchDrinksResult = ({
  isLoading = false,
  currentPage,
  searchResult,
  handleChangePage,
}: SearchDrinksResultProps) => {
  const { t: tCommon } = useTranslation('common')
  const { t: tPage } = useTranslation('pages/SG20_100')
  usePaginationScroll(currentPage, ELEMENT_SEARCH_DRINKS_RESULT_ID)

  return (
    <Suspense fallback={<ArticleCardListSkeleton listLength={DRINKS_PAGE_SIZE} />}>
      <Await resolve={searchResult}>
        {(data) => {
          if (!data.success) {
            return (
              <BaseAlert
                color="error"
                title={tPage('error.getSearchDrinksResult')}
                description={`${tCommon('error.errorMessageTitle')}${data?.error}`}
              />
            )
          }

          const { drinks, totalSize } = data
          const skeletonCount = drinks.length > 0 ? drinks.length : DRINKS_PAGE_SIZE

          return (
            <div id={ELEMENT_SEARCH_DRINKS_RESULT_ID} className={styles.searchDrinksResult}>
              <div className={styles.searchDrinksResult_wrapper}>
                {isLoading ? (
                  <ArticleCardListSkeleton listLength={skeletonCount} />
                ) : (
                  <div className={styles.searchDrinksResult_container}>
                    {drinks.length > 0 ? (
                      <>
                        <ArticleCardList items={drinks} />
                        <div className={styles.searchDrinksResult_pagination}>
                          <BasePagination
                            currentPage={currentPage}
                            totalSize={totalSize}
                            handleChangePage={handleChangePage}
                          />
                        </div>
                      </>
                    ) : (
                      <div className={styles.searchDrinksResultNoResult}>
                        <div className={styles.searchDrinksResultNoResult_container}>
                          <p className={styles.searchDrinksResultNoResult_title}>
                            {tPage('searchDrinksResult.noResult.title')}
                            <br />
                            <ReplaceNewLineText text={tPage('searchDrinksResult.noResult.description')} />
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        }}
      </Await>
    </Suspense>
  )
}
