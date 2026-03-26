import { useMemo, Fragment } from 'react'

import * as styles from './style.css'

import { SvgIcon } from '~/components/ui/icons/SvgIcon'

export type BasePaginationProps = {
  className?: string
  currentPage: number
  totalSize: number
  // 1ページに表示させる件数
  perPageSize?: number
  isDisabled?: boolean
  handleChangePage: (newPage: number) => void
  isHideNumberButton?: boolean
}

const BasePaginationItem = ({
  className,
  currentPage,
  totalPage,
  pageNumber,
  isDisabled,
  handleChangePage,
}: {
  className?: string
  currentPage: number
  totalPage: number
  pageNumber: number
  isDisabled?: boolean
  handleChangePage: (newPage: number) => void
}) => {
  return (
    <li
      className={[
        styles.basePagination_item,
        pageNumber === currentPage && styles.basePagination_item__current,
        pageNumber === 1 && styles.basePagination_item__first,
        pageNumber === totalPage && styles.basePagination_item__last,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {pageNumber === currentPage ? (
        <span className={styles.basePaginationCurrent}>
          <span className={styles.basePaginationCurrent_container}>
            <span className={styles.basePaginationCurrent_text}>{pageNumber}</span>
          </span>
        </span>
      ) : (
        <button
          type="button"
          className={[styles.basePaginationButton, isDisabled && styles.basePaginationButton__disabled]
            .filter(Boolean)
            .join(' ')}
          disabled={isDisabled}
          onClick={() => handleChangePage(pageNumber)}
        >
          <span className={styles.basePaginationButton_container}>
            <span className={styles.basePaginationButton_text}>{pageNumber}</span>
          </span>
        </button>
      )}
    </li>
  )
}

export const BasePagination = ({
  className,
  currentPage,
  totalSize,
  perPageSize = 12,
  isDisabled,
  handleChangePage,
  isHideNumberButton = false,
}: BasePaginationProps) => {
  const totalPage = useMemo(() => {
    return Math.ceil(totalSize / perPageSize) || 1
  }, [totalSize, perPageSize])

  const totalPageArray = useMemo(() => {
    return [...(Array(totalPage) as number[])].map((_, i) => i + 1)
  }, [totalPage])

  return (
    <div className={[styles.basePagination, className].filter(Boolean).join(' ')}>
      <div className={styles.basePagination_container}>
        <ul className={styles.basePagination_items}>
          <li className={[styles.basePagination_item, styles.basePagination_item__prev].filter(Boolean).join(' ')}>
            <button
              type="button"
              className={[
                styles.basePaginationButton,
                styles.basePaginationButton__prev,
                (currentPage === 1 || isDisabled) && styles.basePaginationButton__disabled,
              ]
                .filter(Boolean)
                .join(' ')}
              title="前のページへ"
              aria-label="前のページへ"
              disabled={currentPage === 1 || isDisabled}
              onClick={() => handleChangePage(currentPage - 1)}
            >
              <span className={styles.basePaginationButton_container}>
                <SvgIcon className={styles.basePaginationButton_icon} variant="keyboardArrowLeft" />
              </span>
            </button>
          </li>

          {isHideNumberButton ? (
            <BasePaginationItem
              currentPage={currentPage}
              totalPage={totalPage}
              pageNumber={currentPage}
              handleChangePage={handleChangePage}
              isDisabled={isDisabled}
            />
          ) : (
            <>
              {totalPage <= 5
                ? totalPageArray.map((pageNumber) => {
                    return (
                      <BasePaginationItem
                        key={pageNumber}
                        currentPage={currentPage}
                        totalPage={totalPage}
                        pageNumber={pageNumber}
                        handleChangePage={handleChangePage}
                        className="obj__md obj__lg obj__xl obj__xxl"
                        isDisabled={isDisabled}
                      />
                    )
                  })
                : totalPageArray.map((pageNumber) => {
                    const isShowPrevSeparator: boolean = pageNumber === totalPage && currentPage <= totalPage - 3
                    const isShowNextSeparator: boolean = pageNumber === 1 && currentPage >= 4
                    const isShowItem: boolean =
                      pageNumber === 1 ||
                      pageNumber === totalPage ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)

                    return (
                      <Fragment key={pageNumber}>
                        {isShowPrevSeparator && (
                          <li
                            className={[
                              styles.basePagination_item,
                              styles.basePagination_item__separator,
                              'obj__md obj__lg obj__xl obj__xxl',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            <span className={styles.basePaginationSeparator}>
                              <SvgIcon className={styles.basePaginationSeparator_icon} variant="moreHoriz" />
                            </span>
                          </li>
                        )}

                        {isShowItem && (
                          <BasePaginationItem
                            currentPage={currentPage}
                            totalPage={totalPage}
                            pageNumber={pageNumber}
                            handleChangePage={handleChangePage}
                            className="obj__md obj__lg obj__xl obj__xxl"
                            isDisabled={isDisabled}
                          />
                        )}

                        {isShowNextSeparator && (
                          <li
                            className={[
                              styles.basePagination_item,
                              styles.basePagination_item__separator,
                              'obj__md obj__lg obj__xl obj__xxl',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            <span className={styles.basePaginationSeparator}>
                              <SvgIcon className={styles.basePaginationSeparator_icon} variant="moreHoriz" />
                            </span>
                          </li>
                        )}
                      </Fragment>
                    )
                  })}

              {totalPage <= 3
                ? totalPageArray.map((pageNumber) => {
                    return (
                      <BasePaginationItem
                        key={pageNumber}
                        currentPage={currentPage}
                        totalPage={totalPage}
                        pageNumber={pageNumber}
                        handleChangePage={handleChangePage}
                        className="obj__xs obj__sm"
                        isDisabled={isDisabled}
                      />
                    )
                  })
                : totalPageArray.map((pageNumber) => {
                    const isShowPrevSeparator: boolean = pageNumber === totalPage && currentPage <= totalPage - 2
                    const isShowNextSeparator: boolean = pageNumber === 1 && currentPage >= 3
                    const isShowItem: boolean =
                      pageNumber === 1 ||
                      pageNumber === totalPage ||
                      (pageNumber >= currentPage && pageNumber <= currentPage)

                    return (
                      <Fragment key={pageNumber}>
                        {isShowPrevSeparator && (
                          <li
                            className={[
                              styles.basePagination_item,
                              styles.basePagination_item__separator,
                              'obj__xs obj__sm',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            <span className={styles.basePaginationSeparator}>
                              <SvgIcon className={styles.basePaginationSeparator_icon} variant="moreHoriz" />
                            </span>
                          </li>
                        )}

                        {isShowItem && (
                          <BasePaginationItem
                            currentPage={currentPage}
                            totalPage={totalPage}
                            pageNumber={pageNumber}
                            handleChangePage={handleChangePage}
                            className="obj__xs obj__sm"
                            isDisabled={isDisabled}
                          />
                        )}

                        {isShowNextSeparator && (
                          <li
                            className={[
                              styles.basePagination_item,
                              styles.basePagination_item__separator,
                              'obj__xs obj__sm',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            <span className={styles.basePaginationSeparator}>
                              <SvgIcon className={styles.basePaginationSeparator_icon} variant="moreHoriz" />
                            </span>
                          </li>
                        )}
                      </Fragment>
                    )
                  })}
            </>
          )}

          <li className={[styles.basePagination_item, styles.basePagination_item__next].filter(Boolean).join(' ')}>
            <button
              type="button"
              className={[
                styles.basePaginationButton,
                styles.basePaginationButton__next,
                (currentPage >= totalPage || totalPage <= 1 || isDisabled) && styles.basePaginationButton__disabled,
              ]
                .filter(Boolean)
                .join(' ')}
              title="次のページへ"
              aria-label="次のページへ"
              disabled={currentPage >= totalPage || totalPage <= 1 || isDisabled}
              onClick={() => handleChangePage(currentPage + 1)}
            >
              <span className={styles.basePaginationButton_container}>
                <SvgIcon className={styles.basePaginationButton_icon} variant="keyboardArrowRight" />
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
