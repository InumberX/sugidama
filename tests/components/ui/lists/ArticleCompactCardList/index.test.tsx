import { render, type RenderResult, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { ArticleCompactCardList } from '~/components/ui/lists/ArticleCompactCardList'

import type { ArticleCompactCardProps } from '~/components/ui/cards/ArticleCompactCard'

describe('ArticleCompactCardList', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('基本的なリスト表示', () => {
      const items: ArticleCompactCardProps[] = [
        { title: { text: '記事1' } },
        { title: { text: '記事2' } },
        { title: { text: '記事3' } },
      ]

      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCardList items={items} />
          </MemoryRouter>
        )
      })

      test('指定した数のカードが表示される', () => {
        const cards = result.container.querySelectorAll('article')
        expect(cards.length).toBe(3)
      })

      test('各カードのタイトルが正しく表示される', () => {
        expect(result.container.textContent).toContain('記事1')
        expect(result.container.textContent).toContain('記事2')
        expect(result.container.textContent).toContain('記事3')
      })
    })

    describe('空のリスト', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCardList items={[]} />
          </MemoryRouter>
        )
      })

      test('ラッパー要素は存在するがカードは表示されない', () => {
        const wrapper = result.container.querySelector('div[class*="articleCompactCardList"]')
        const cards = result.container.querySelectorAll('article')

        expect(wrapper).not.toBe(null)
        expect(cards.length).toBe(0)
      })
    })

    describe('カードのプロパティ伝播', () => {
      const items: ArticleCompactCardProps[] = [
        {
          title: { text: 'リンクカード', titleTag: 'h3' },
          description: { text: '説明文' },
          button: { url: '/path' },
        },
        {
          title: { text: 'タグ付きカード' },
          tags: [{ children: 'タグ1' }, { children: 'タグ2' }],
        },
        {
          title: { text: '画像カード' },
          thumbnail: { src: '/image.jpg', alt: 'テスト画像' },
        },
      ]

      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCardList items={items} />
          </MemoryRouter>
        )
      })

      test('description が正しく伝播される', () => {
        expect(result.container.textContent).toContain('説明文')
      })

      test('titleTag が正しく伝播される', () => {
        const h3 = result.container.querySelector('h3')
        expect(h3).not.toBe(null)
        expect(h3?.textContent).toBe('リンクカード')
      })

      test('button の url が正しく伝播される', () => {
        const link = result.container.querySelector('a[href="/path"]')
        expect(link).not.toBe(null)
      })

      test('tags が正しく伝播される', () => {
        expect(result.container.textContent).toContain('タグ1')
        expect(result.container.textContent).toContain('タグ2')
      })

      test('thumbnail が正しく伝播される', () => {
        const img = result.container.querySelector('img[src="/image.jpg"]')
        expect(img).not.toBe(null)
        expect(img?.getAttribute('alt')).toBe('テスト画像')
      })
    })

    describe('単一アイテム', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCardList items={[{ title: { text: '単一記事' } }]} />
          </MemoryRouter>
        )
      })

      test('1つのカードが表示される', () => {
        const cards = result.container.querySelectorAll('article')
        expect(cards.length).toBe(1)
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('ベーススタイル', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCardList items={[{ title: { text: 'テスト' } }]} />
          </MemoryRouter>
        )
      })

      test('articleCompactCardList クラスが適用されている', () => {
        const wrapper = result.container.firstElementChild
        expect(wrapper?.className).toContain('articleCompactCardList')
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCardList items={[{ title: { text: 'テスト' } }]} className="custom-class" />
          </MemoryRouter>
        )
      })

      test('カスタムクラス名がラッパーに適用される', () => {
        const wrapper = result.container.firstElementChild
        expect(wrapper?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('内部構造', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCardList items={[{ title: { text: 'テスト' } }]} />
          </MemoryRouter>
        )
      })

      test('articleCompactCardList_items クラスを持つ要素が存在する', () => {
        const items = result.container.querySelector('div[class*="articleCompactCardList_items"]')
        expect(items).not.toBe(null)
      })

      test('articleCompactCardList_item クラスを持つ要素が存在する', () => {
        const item = result.container.querySelector('div[class*="articleCompactCardList_item"]')
        expect(item).not.toBe(null)
      })
    })

    describe('複数アイテムの構造', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCardList
              items={[{ title: { text: '記事1' } }, { title: { text: '記事2' } }, { title: { text: '記事3' } }]}
            />
          </MemoryRouter>
        )
      })

      test('各アイテムが articleCompactCardList_item でラップされている', () => {
        const itemsContainer = result.container.querySelector('div[class*="articleCompactCardList_items"]')
        const itemWrappers = itemsContainer?.querySelectorAll(':scope > div')
        expect(itemWrappers?.length).toBe(3)
      })
    })
  })

  //============================================================================
  // 3. Operation
  //============================================================================
  describe('Operation', () => {
    describe('リンクカードのクリック', () => {
      const items: ArticleCompactCardProps[] = [
        { title: { text: '内部リンク' }, button: { url: '/internal' } },
        { title: { text: '外部リンク' }, button: { url: 'https://example.com' } },
      ]

      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCardList items={items} />
          </MemoryRouter>
        )
      })

      test('内部リンクが正しく設定されている', () => {
        const internalLink = result.container.querySelector('a[href="/internal"]')
        expect(internalLink).not.toBe(null)
      })

      test('外部リンクが正しく設定されている', () => {
        const externalLink = result.container.querySelector('a[href="https://example.com"]')
        expect(externalLink).not.toBe(null)
      })
    })

    describe('クリックイベントカード', () => {
      const handleClick1 = vi.fn()
      const handleClick2 = vi.fn()
      const items: ArticleCompactCardProps[] = [
        { title: { text: 'カード1' }, button: { onClick: handleClick1 } },
        { title: { text: 'カード2' }, button: { onClick: handleClick2 } },
      ]

      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCardList items={items} />
          </MemoryRouter>
        )
      })

      test('各カードのクリックイベントが独立して動作する', () => {
        const buttons = result.container.querySelectorAll('h2 button')

        if (buttons.length < 2) {
          throw new Error('The target elements were not found.')
        }

        fireEvent.click(buttons[0])
        expect(handleClick1).toHaveBeenCalledTimes(1)
        expect(handleClick2).not.toHaveBeenCalled()

        fireEvent.click(buttons[1])
        expect(handleClick1).toHaveBeenCalledTimes(1)
        expect(handleClick2).toHaveBeenCalledTimes(1)
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
  describe('Others', () => {
    describe('アイテムの順序', () => {
      const items: ArticleCompactCardProps[] = [
        { title: { text: '最初の記事' } },
        { title: { text: '2番目の記事' } },
        { title: { text: '最後の記事' } },
      ]

      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCardList items={items} />
          </MemoryRouter>
        )
      })

      test('アイテムが配列の順序通りに表示される', () => {
        const titles = result.container.querySelectorAll('h2')
        expect(titles[0]?.textContent).toBe('最初の記事')
        expect(titles[1]?.textContent).toBe('2番目の記事')
        expect(titles[2]?.textContent).toBe('最後の記事')
      })
    })

    describe('異なるプロパティを持つカードの混在', () => {
      const items: ArticleCompactCardProps[] = [
        { title: { text: 'シンプルカード' } },
        {
          title: { text: 'フルカード' },
          description: { text: '説明付き' },
          tags: [{ children: 'タグ' }],
          thumbnail: { src: '/img.jpg' },
          button: { url: '/link' },
        },
      ]

      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCardList items={items} />
          </MemoryRouter>
        )
      })

      test('異なるプロパティを持つカードが共存できる', () => {
        const cards = result.container.querySelectorAll('article')
        expect(cards.length).toBe(2)

        expect(result.container.textContent).toContain('シンプルカード')
        expect(result.container.textContent).toContain('フルカード')
        expect(result.container.textContent).toContain('説明付き')
        expect(result.container.textContent).toContain('タグ')
      })
    })

    describe('articleTag の伝播', () => {
      const items: ArticleCompactCardProps[] = [
        { title: { text: 'セクション' }, articleTag: 'section' },
        { title: { text: '記事' }, articleTag: 'article' },
      ]

      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCardList items={items} />
          </MemoryRouter>
        )
      })

      test('各カードに異なる articleTag が適用される', () => {
        const section = result.container.querySelector('section')
        const article = result.container.querySelector('article')

        expect(section).not.toBe(null)
        expect(section?.textContent).toContain('セクション')
        expect(article).not.toBe(null)
        expect(article?.textContent).toContain('記事')
      })
    })
  })
})
