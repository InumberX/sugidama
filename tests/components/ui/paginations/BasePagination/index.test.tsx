import { render, type RenderResult, cleanup, fireEvent } from '@testing-library/react'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { BasePagination } from '~/components/ui/paginations/BasePagination'

describe('BasePagination', () => {
  let result: RenderResult
  const handleChangePage = vi.fn()

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('基本的な出力', () => {
      beforeEach(() => {
        result = render(<BasePagination currentPage={1} totalSize={50} handleChangePage={handleChangePage} />)
      })

      test('ページネーション要素が正常に出力されている', () => {
        const pagination = result.container.querySelector('div[class*="basePagination"]')
        expect(pagination).not.toBe(null)
      })

      test('前へボタンが存在する', () => {
        const prevButton = result.getByLabelText('前のページへ')
        expect(prevButton).not.toBe(null)
      })

      test('次へボタンが存在する', () => {
        const nextButton = result.getByLabelText('次のページへ')
        expect(nextButton).not.toBe(null)
      })
    })

    describe('totalPage の計算', () => {
      test('totalSize=50, perPageSize=12 の場合、5ページになる', () => {
        result = render(<BasePagination currentPage={1} totalSize={50} handleChangePage={handleChangePage} />)
        const pageItems = result.container.querySelectorAll('li[class*="basePagination_item"]')
        // 前へ(1) + md/lg用ページ1〜5(5) + xs/sm用ページ1,セパレーター,ページ5(3) + 次へ(1) = 10
        expect(pageItems.length).toBe(10)
      })

      test('totalSize=100, perPageSize=10 の場合、10ページになる', () => {
        result = render(
          <BasePagination currentPage={1} totalSize={100} perPageSize={10} handleChangePage={handleChangePage} />
        )
        // 総ページ数が5を超えるので、省略表示される
        const pagination = result.container.querySelector('div[class*="basePagination"]')
        expect(pagination).not.toBe(null)
      })

      test('totalSize=0 の場合、1ページになる', () => {
        result = render(<BasePagination currentPage={1} totalSize={0} handleChangePage={handleChangePage} />)
        const pagination = result.container.querySelector('div[class*="basePagination"]')
        expect(pagination).not.toBe(null)
      })
    })

    describe('perPageSize のデフォルト値', () => {
      test('perPageSize を指定しない場合、デフォルト値 12 が適用される', () => {
        // totalSize=24 でデフォルト perPageSize=12 なら totalPage=2
        result = render(<BasePagination currentPage={1} totalSize={24} handleChangePage={handleChangePage} />)
        const pageButtons = result.container.querySelectorAll('button[class*="basePaginationButton"]')
        // 前へ + ページ2 + 次へ = 3 (ページ1は現在ページなのでspan)
        const page2Button = Array.from(pageButtons).find((btn) => btn.textContent === '2')
        expect(page2Button).not.toBe(undefined)

        // ページ3は存在しない
        const page3Button = Array.from(pageButtons).find((btn) => btn.textContent === '3')
        expect(page3Button).toBe(undefined)
      })
    })

    describe('境界値テスト', () => {
      test('totalSize が perPageSize で割り切れる場合（totalSize=36, perPageSize=12 → 3ページ）', () => {
        result = render(
          <BasePagination currentPage={1} totalSize={36} perPageSize={12} handleChangePage={handleChangePage} />
        )
        const pageButtons = result.container.querySelectorAll('button[class*="basePaginationButton"]')
        const page3Button = Array.from(pageButtons).find((btn) => btn.textContent === '3')
        expect(page3Button).not.toBe(undefined)

        const page4Button = Array.from(pageButtons).find((btn) => btn.textContent === '4')
        expect(page4Button).toBe(undefined)
      })

      test('totalSize が perPageSize で割り切れない場合（totalSize=37, perPageSize=12 → 4ページ）', () => {
        result = render(
          <BasePagination currentPage={1} totalSize={37} perPageSize={12} handleChangePage={handleChangePage} />
        )
        const pageButtons = result.container.querySelectorAll('button[class*="basePaginationButton"]')
        const page4Button = Array.from(pageButtons).find((btn) => btn.textContent === '4')
        expect(page4Button).not.toBe(undefined)

        const page5Button = Array.from(pageButtons).find((btn) => btn.textContent === '5')
        expect(page5Button).toBe(undefined)
      })

      test('totalSize=1 の場合、1ページのみ', () => {
        result = render(<BasePagination currentPage={1} totalSize={1} handleChangePage={handleChangePage} />)
        const currentPage = result.container.querySelector('span[class*="basePaginationCurrent_text"]')
        expect(currentPage?.textContent).toBe('1')

        const pageButtons = result.container.querySelectorAll('button[class*="basePaginationButton"]')
        const page2Button = Array.from(pageButtons).find((btn) => btn.textContent === '2')
        expect(page2Button).toBe(undefined)
      })
    })

    describe('isHideNumberButton', () => {
      beforeEach(() => {
        result = render(
          <BasePagination
            currentPage={3}
            totalSize={100}
            handleChangePage={handleChangePage}
            isHideNumberButton={true}
          />
        )
      })

      test('現在のページ番号のみが表示される', () => {
        const currentPageElement = result.container.querySelector('span[class*="basePaginationCurrent_text"]')
        expect(currentPageElement?.textContent).toBe('3')
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <BasePagination
            className="custom-pagination"
            currentPage={1}
            totalSize={50}
            handleChangePage={handleChangePage}
          />
        )
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const pagination = result.container.querySelector('div[class*="basePagination"]')
        expect(pagination?.classList.contains('custom-pagination')).toBe(true)
      })
    })

    describe('現在のページのスタイル', () => {
      beforeEach(() => {
        result = render(<BasePagination currentPage={2} totalSize={50} handleChangePage={handleChangePage} />)
      })

      test('現在のページは span 要素で表示される', () => {
        const currentPage = result.container.querySelector('span[class*="basePaginationCurrent_text"]')
        expect(currentPage?.textContent).toBe('2')
      })

      test('現在のページにはボタンではなく span が使用される', () => {
        const currentPageItem = result.container.querySelector('li[class*="basePagination_item__current"]')
        const button = currentPageItem?.querySelector('button')
        expect(button).toBe(null)
      })
    })

    describe('総ページ数が5以下の場合', () => {
      beforeEach(() => {
        result = render(<BasePagination currentPage={1} totalSize={50} handleChangePage={handleChangePage} />)
      })

      test('すべてのページ番号ボタンが表示される', () => {
        // ページ1〜5のボタン/span を確認
        const pageItems = result.container.querySelectorAll('li[class*="basePagination_item"]')
        // 前へ + 5ページ(md/lg)分 + 5ページ(xs/sm)分 + 次へ = 12
        expect(pageItems.length).toBeGreaterThanOrEqual(7)
      })
    })

    describe('総ページ数が5を超える場合（省略表示）', () => {
      beforeEach(() => {
        result = render(
          <BasePagination currentPage={5} totalSize={120} perPageSize={12} handleChangePage={handleChangePage} />
        )
      })

      test('セパレーターが表示される', () => {
        const separators = result.container.querySelectorAll('li[class*="basePagination_item__separator"]')
        expect(separators.length).toBeGreaterThan(0)
      })
    })

    describe('省略表示の詳細ロジック（totalPage=10）', () => {
      // ヘルパー関数: 表示されているページ番号を取得
      const getDisplayedPageNumbers = (container: HTMLElement): number[] => {
        const pageTexts = container.querySelectorAll(
          'span[class*="basePaginationCurrent_text"], span[class*="basePaginationButton_text"]'
        )
        return Array.from(pageTexts)
          .map((el) => parseInt(el.textContent || '', 10))
          .filter((n) => !isNaN(n))
      }

      describe('先頭付近（currentPage=1）', () => {
        beforeEach(() => {
          // totalPage=10
          result = render(
            <BasePagination currentPage={1} totalSize={100} perPageSize={10} handleChangePage={handleChangePage} />
          )
        })

        test('ページ1, 2, 10 が表示される（md/lg表示）', () => {
          const displayedPages = getDisplayedPageNumbers(result.container)
          expect(displayedPages).toContain(1)
          expect(displayedPages).toContain(2)
          expect(displayedPages).toContain(10)
        })

        test('最終ページ前にセパレーターが表示される', () => {
          const separators = result.container.querySelectorAll('li[class*="basePagination_item__separator"]')
          expect(separators.length).toBeGreaterThan(0)
        })
      })

      describe('先頭付近（currentPage=2）', () => {
        beforeEach(() => {
          result = render(
            <BasePagination currentPage={2} totalSize={100} perPageSize={10} handleChangePage={handleChangePage} />
          )
        })

        test('ページ1, 2, 3, 10 が表示される', () => {
          const displayedPages = getDisplayedPageNumbers(result.container)
          expect(displayedPages).toContain(1)
          expect(displayedPages).toContain(2)
          expect(displayedPages).toContain(3)
          expect(displayedPages).toContain(10)
        })
      })

      describe('中間（currentPage=5）', () => {
        beforeEach(() => {
          result = render(
            <BasePagination currentPage={5} totalSize={100} perPageSize={10} handleChangePage={handleChangePage} />
          )
        })

        test('ページ1, 4, 5, 6, 10 が表示される', () => {
          const displayedPages = getDisplayedPageNumbers(result.container)
          expect(displayedPages).toContain(1)
          expect(displayedPages).toContain(4)
          expect(displayedPages).toContain(5)
          expect(displayedPages).toContain(6)
          expect(displayedPages).toContain(10)
        })

        test('両側にセパレーターが表示される', () => {
          // md/lg用とxs/sm用で複数のセパレーターがある
          const separators = result.container.querySelectorAll('li[class*="basePagination_item__separator"]')
          expect(separators.length).toBeGreaterThanOrEqual(2)
        })
      })

      describe('末尾付近（currentPage=9）', () => {
        beforeEach(() => {
          result = render(
            <BasePagination currentPage={9} totalSize={100} perPageSize={10} handleChangePage={handleChangePage} />
          )
        })

        test('ページ1, 8, 9, 10 が表示される', () => {
          const displayedPages = getDisplayedPageNumbers(result.container)
          expect(displayedPages).toContain(1)
          expect(displayedPages).toContain(8)
          expect(displayedPages).toContain(9)
          expect(displayedPages).toContain(10)
        })
      })

      describe('最終ページ（currentPage=10）', () => {
        beforeEach(() => {
          result = render(
            <BasePagination currentPage={10} totalSize={100} perPageSize={10} handleChangePage={handleChangePage} />
          )
        })

        test('ページ1, 9, 10 が表示される', () => {
          const displayedPages = getDisplayedPageNumbers(result.container)
          expect(displayedPages).toContain(1)
          expect(displayedPages).toContain(9)
          expect(displayedPages).toContain(10)
        })

        test('先頭ページ後にセパレーターが表示される', () => {
          const separators = result.container.querySelectorAll('li[class*="basePagination_item__separator"]')
          expect(separators.length).toBeGreaterThan(0)
        })
      })
    })

    describe('先頭ページの表示', () => {
      beforeEach(() => {
        result = render(<BasePagination currentPage={1} totalSize={50} handleChangePage={handleChangePage} />)
      })

      test('最初のページアイテムに first クラスが適用される', () => {
        const firstItem = result.container.querySelector('li[class*="basePagination_item__first"]')
        expect(firstItem).not.toBe(null)
      })
    })

    describe('最終ページの表示', () => {
      beforeEach(() => {
        result = render(<BasePagination currentPage={1} totalSize={50} handleChangePage={handleChangePage} />)
      })

      test('最後のページアイテムに last クラスが適用される', () => {
        const lastItem = result.container.querySelector('li[class*="basePagination_item__last"]')
        expect(lastItem).not.toBe(null)
      })
    })
  })

  //============================================================================
  // 3. Operation
  //============================================================================
  describe('Operation', () => {
    describe('ページ番号クリック', () => {
      beforeEach(() => {
        result = render(<BasePagination currentPage={1} totalSize={50} handleChangePage={handleChangePage} />)
      })

      test('ページ番号ボタンをクリックすると handleChangePage が呼ばれる', () => {
        const pageButtons = result.container.querySelectorAll('button[class*="basePaginationButton"]')
        // 前へボタン以外のページボタンを探す
        const page2Button = Array.from(pageButtons).find((btn) => btn.textContent === '2')

        if (!page2Button) {
          throw new Error('Page 2 button not found')
        }

        fireEvent.click(page2Button)
        expect(handleChangePage).toHaveBeenCalledWith(2)
      })
    })

    describe('前へボタン', () => {
      test('最初のページでは前へボタンが無効化される', () => {
        result = render(<BasePagination currentPage={1} totalSize={50} handleChangePage={handleChangePage} />)
        const prevButton = result.getByLabelText('前のページへ')
        expect(prevButton).toBeDisabled()
      })

      test('2ページ目以降では前へボタンが有効', () => {
        result = render(<BasePagination currentPage={2} totalSize={50} handleChangePage={handleChangePage} />)
        const prevButton = result.getByLabelText('前のページへ')
        expect(prevButton).not.toBeDisabled()
      })

      test('前へボタンをクリックすると currentPage - 1 で handleChangePage が呼ばれる', () => {
        result = render(<BasePagination currentPage={3} totalSize={50} handleChangePage={handleChangePage} />)
        const prevButton = result.getByLabelText('前のページへ')
        fireEvent.click(prevButton)
        expect(handleChangePage).toHaveBeenCalledWith(2)
      })
    })

    describe('次へボタン', () => {
      test('最後のページでは次へボタンが無効化される', () => {
        // totalSize=50, perPageSize=12 -> totalPage=5
        result = render(<BasePagination currentPage={5} totalSize={50} handleChangePage={handleChangePage} />)
        const nextButton = result.getByLabelText('次のページへ')
        expect(nextButton).toBeDisabled()
      })

      test('最後のページ以外では次へボタンが有効', () => {
        result = render(<BasePagination currentPage={1} totalSize={50} handleChangePage={handleChangePage} />)
        const nextButton = result.getByLabelText('次のページへ')
        expect(nextButton).not.toBeDisabled()
      })

      test('次へボタンをクリックすると currentPage + 1 で handleChangePage が呼ばれる', () => {
        result = render(<BasePagination currentPage={2} totalSize={50} handleChangePage={handleChangePage} />)
        const nextButton = result.getByLabelText('次のページへ')
        fireEvent.click(nextButton)
        expect(handleChangePage).toHaveBeenCalledWith(3)
      })
    })

    describe('isDisabled', () => {
      beforeEach(() => {
        result = render(
          <BasePagination currentPage={2} totalSize={50} handleChangePage={handleChangePage} isDisabled={true} />
        )
      })

      test('isDisabled が true の場合、前へボタンが無効化される', () => {
        const prevButton = result.getByLabelText('前のページへ')
        expect(prevButton).toBeDisabled()
      })

      test('isDisabled が true の場合、次へボタンが無効化される', () => {
        const nextButton = result.getByLabelText('次のページへ')
        expect(nextButton).toBeDisabled()
      })

      test('isDisabled が true の場合、ページ番号ボタンも無効化される', () => {
        const pageButtons = result.container.querySelectorAll('button[class*="basePaginationButton"]')
        pageButtons.forEach((button) => {
          expect(button).toBeDisabled()
        })
      })
    })

    describe('1ページしかない場合', () => {
      beforeEach(() => {
        result = render(<BasePagination currentPage={1} totalSize={10} handleChangePage={handleChangePage} />)
      })

      test('前へボタンが無効化される', () => {
        const prevButton = result.getByLabelText('前のページへ')
        expect(prevButton).toBeDisabled()
      })

      test('次へボタンが無効化される', () => {
        const nextButton = result.getByLabelText('次のページへ')
        expect(nextButton).toBeDisabled()
      })
    })
  })

  //============================================================================
  // 4. Validation (for forms)
  //============================================================================
  describe.skip('Validation', () => {})

  //============================================================================
  // 5. Others (Optional)
  //============================================================================
  describe.skip('Others (Optional)', () => {})
})
