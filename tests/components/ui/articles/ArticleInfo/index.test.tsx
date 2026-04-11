import { cleanup, render, type RenderResult } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import { ArticleInfo } from '~/components/ui/articles/ArticleInfo'

describe('ArticleInfo', () => {
  let result: RenderResult

  const items = [
    {
      title: 'タイトル1',
      text: 'テキスト1',
    },
    {
      title: 'タイトル2',
      text: 'テキスト2',
    },
  ]

  afterEach(() => {
    cleanup()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('アイテムが1件の場合', () => {
      beforeEach(() => {
        result = render(
          <ArticleInfo
            items={[
              {
                title: '単一タイトル',
                text: '単一テキスト',
              },
            ]}
          />
        )
      })

      test('dl 要素が1件出力される', () => {
        const dlElements = result.container.querySelectorAll('dl')
        expect(dlElements).toHaveLength(1)
      })

      test('タイトルが正しく出力される', () => {
        const dt = result.container.querySelector('dt')
        expect(dt?.textContent).toBe('単一タイトル')
      })

      test('テキストが正しく出力される', () => {
        const dd = result.container.querySelector('dd')
        expect(dd?.textContent).toBe('単一テキスト')
      })
    })

    describe('アイテムが複数件の場合', () => {
      beforeEach(() => {
        result = render(<ArticleInfo items={items} />)
      })

      test('dl 要素がアイテム数分出力される', () => {
        const dlElements = result.container.querySelectorAll('dl')
        expect(dlElements).toHaveLength(2)
      })

      test('各タイトルが正しく出力される', () => {
        const dtElements = result.container.querySelectorAll('dt')
        expect(dtElements[0]?.textContent).toBe('タイトル1')
        expect(dtElements[1]?.textContent).toBe('タイトル2')
      })

      test('各テキストが正しく出力される', () => {
        const ddElements = result.container.querySelectorAll('dd')
        expect(ddElements[0]?.textContent).toBe('テキスト1')
        expect(ddElements[1]?.textContent).toBe('テキスト2')
      })
    })

    describe('改行を含むテキストの場合', () => {
      beforeEach(() => {
        result = render(
          <ArticleInfo
            items={[
              {
                title: '行1\n行2',
                text: 'テキスト行1\nテキスト行2',
              },
            ]}
          />
        )
      })

      test('タイトル内に br 要素が出力される', () => {
        const dt = result.container.querySelector('dt')
        const brElements = dt?.querySelectorAll('br')
        expect(brElements).toHaveLength(1)
      })

      test('テキスト内に br 要素が出力される', () => {
        const dd = result.container.querySelector('dd')
        const brElements = dd?.querySelectorAll('br')
        expect(brElements).toHaveLength(1)
      })
    })

    describe('空のアイテム配列の場合', () => {
      beforeEach(() => {
        result = render(<ArticleInfo items={[]} />)
      })

      test('dl 要素が出力されない', () => {
        const dlElements = result.container.querySelectorAll('dl')
        expect(dlElements).toHaveLength(0)
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('クラス名', () => {
      beforeEach(() => {
        result = render(<ArticleInfo items={items} className="custom-class" />)
      })

      test('ラッパーに articleInfo クラスが付与される', () => {
        const wrapper = result.container.firstElementChild
        expect(wrapper?.className).toContain('articleInfo')
      })

      test('カスタムクラス名が付与される', () => {
        const wrapper = result.container.firstElementChild
        expect(wrapper?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('className を省略した場合', () => {
      beforeEach(() => {
        result = render(<ArticleInfo items={items} />)
      })

      test('articleInfo クラスのみ付与される', () => {
        const wrapper = result.container.firstElementChild
        expect(wrapper?.className).toContain('articleInfo')
      })
    })

    describe('内部構造', () => {
      beforeEach(() => {
        result = render(<ArticleInfo items={items} />)
      })

      test('articleInfo_container クラスを持つ要素が存在する', () => {
        const container = result.container.querySelector('div[class*="articleInfo_container"]')
        expect(container).not.toBe(null)
      })

      test('articleInfo_items クラスを持つ要素が存在する', () => {
        const itemsElm = result.container.querySelector('div[class*="articleInfo_items"]')
        expect(itemsElm).not.toBe(null)
      })

      test('dl 要素に articleInfo_item クラスが付与される', () => {
        const dlElements = result.container.querySelectorAll('dl[class*="articleInfo_item"]')
        expect(dlElements).toHaveLength(2)
      })

      test('dt 要素に articleInfo_title クラスが付与される', () => {
        const dtElements = result.container.querySelectorAll('dt[class*="articleInfo_title"]')
        expect(dtElements).toHaveLength(2)
      })

      test('dd 要素に articleInfo_text クラスが付与される', () => {
        const ddElements = result.container.querySelectorAll('dd[class*="articleInfo_text"]')
        expect(ddElements).toHaveLength(2)
      })
    })
  })

  //============================================================================
  // 3. Operation
  //============================================================================
  describe.skip('Operation', () => {})

  //============================================================================
  // 4. Validation (for forms)
  //============================================================================
  describe.skip('Validation', () => {})

  //============================================================================
  // 5. Others (Optional)
  //============================================================================
  describe.skip('Others (Optional)', () => {})
})
