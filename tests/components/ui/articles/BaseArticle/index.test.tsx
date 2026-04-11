import { cleanup, render, type RenderResult } from '@testing-library/react'
import { useEffect } from 'react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { BaseArticle } from '~/components/ui/articles/BaseArticle'

type MockSliderOptions = {
  created?: () => void
  slideChanged?: (slider: { track: { details: { rel: number } } }) => void
}

vi.mock('keen-slider/react', () => {
  return {
    useKeenSlider: (options: MockSliderOptions) => {
      useEffect(() => {
        options.created?.()
      }, [options])

      return [
        vi.fn(),
        {
          current: {
            moveToIdx: vi.fn(),
            prev: vi.fn(),
            next: vi.fn(),
          },
        },
      ]
    },
  }
})

describe('BaseArticle', () => {
  let result: RenderResult

  const defaultProps = {
    title: {
      text: '記事タイトル',
    },
  }

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('タイトルのみの場合', () => {
      beforeEach(() => {
        result = render(<BaseArticle {...defaultProps} />)
      })

      test('タイトルが正しく出力される', () => {
        const titleElm = result.container.querySelector('h1')
        expect(titleElm?.textContent).toBe('記事タイトル')
      })

      test('メインビジュアル領域が出力されない', () => {
        const mainVisual = result.container.querySelector('div[class*="baseArticleMainVisual"]')
        expect(mainVisual).toBe(null)
      })

      test('情報領域が出力されない', () => {
        const info = result.container.querySelector('div[class*="baseArticleInfo"]')
        expect(info).toBe(null)
      })

      test('タグ領域が出力されない', () => {
        const tags = result.container.querySelector('div[class*="baseArticleTags"]')
        expect(tags).toBe(null)
      })
    })

    describe('titleTag を指定した場合', () => {
      beforeEach(() => {
        result = render(<BaseArticle title={{ text: '見出し', titleTag: 'h2' }} />)
      })

      test('指定したタグで出力される', () => {
        const h2 = result.container.querySelector('h2')
        expect(h2?.textContent).toBe('見出し')
      })
    })

    describe('メインビジュアルがある場合', () => {
      beforeEach(() => {
        result = render(
          <BaseArticle
            {...defaultProps}
            mainVisuals={[
              { src: '/images/1.jpg', alt: '画像1' },
              { src: '/images/2.jpg', alt: '画像2' },
            ]}
          />
        )
      })

      test('メインビジュアル領域が出力される', () => {
        const mainVisual = result.container.querySelector('div[class*="baseArticleMainVisual"]')
        expect(mainVisual).not.toBe(null)
      })

      test('画像が出力される', () => {
        const images = result.container.querySelectorAll('img')
        expect(images.length).toBeGreaterThan(0)
      })
    })

    describe('メインビジュアルが空配列の場合', () => {
      beforeEach(() => {
        result = render(<BaseArticle {...defaultProps} mainVisuals={[]} />)
      })

      test('メインビジュアル領域が出力されない', () => {
        const mainVisual = result.container.querySelector('div[class*="baseArticleMainVisual"]')
        expect(mainVisual).toBe(null)
      })
    })

    describe('info がある場合', () => {
      beforeEach(() => {
        result = render(
          <BaseArticle
            {...defaultProps}
            info={{
              items: [
                { title: '産地', text: '京都' },
                { title: '度数', text: '15%' },
              ],
            }}
          />
        )
      })

      test('情報領域が出力される', () => {
        const info = result.container.querySelector('div[class*="baseArticleInfo"]')
        expect(info).not.toBe(null)
      })

      test('情報アイテムが正しく出力される', () => {
        const dtElements = result.container.querySelectorAll('dt')
        expect(dtElements[0]?.textContent).toBe('産地')
        expect(dtElements[1]?.textContent).toBe('度数')

        const ddElements = result.container.querySelectorAll('dd')
        expect(ddElements[0]?.textContent).toBe('京都')
        expect(ddElements[1]?.textContent).toBe('15%')
      })
    })

    describe('info の items が空配列の場合', () => {
      beforeEach(() => {
        result = render(<BaseArticle {...defaultProps} info={{ items: [] }} />)
      })

      test('情報領域が出力されない', () => {
        const info = result.container.querySelector('div[class*="baseArticleInfo"]')
        expect(info).toBe(null)
      })
    })

    describe('info の items が undefined の場合', () => {
      beforeEach(() => {
        result = render(<BaseArticle {...defaultProps} info={{}} />)
      })

      test('情報領域が出力されない', () => {
        const info = result.container.querySelector('div[class*="baseArticleInfo"]')
        expect(info).toBe(null)
      })
    })

    describe('tags がある場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseArticle {...defaultProps} tags={[{ children: 'タグ1' }, { children: 'タグ2' }]} />
          </MemoryRouter>
        )
      })

      test('タグ領域が出力される', () => {
        const tags = result.container.querySelector('div[class*="baseArticleTags"]')
        expect(tags).not.toBe(null)
      })

      test('タグが正しく出力される', () => {
        const tagElements = result.container.querySelectorAll('li')
        expect(tagElements).toHaveLength(2)
      })
    })

    describe('tags が空配列の場合', () => {
      beforeEach(() => {
        result = render(<BaseArticle {...defaultProps} tags={[]} />)
      })

      test('タグ領域が出力されない', () => {
        const tags = result.container.querySelector('div[class*="baseArticleTags"]')
        expect(tags).toBe(null)
      })
    })

    describe('すべてのプロパティを指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseArticle
              title={{ text: 'フルテスト' }}
              mainVisuals={[{ src: '/images/test.jpg', alt: 'テスト画像' }]}
              info={{ items: [{ title: '情報', text: '値' }] }}
              tags={[{ children: 'タグ' }]}
            />
          </MemoryRouter>
        )
      })

      test('すべての領域が出力される', () => {
        expect(result.container.querySelector('div[class*="baseArticleTitle"]')).not.toBe(null)
        expect(result.container.querySelector('div[class*="baseArticleMainVisual"]')).not.toBe(null)
        expect(result.container.querySelector('div[class*="baseArticleInfo"]')).not.toBe(null)
        expect(result.container.querySelector('div[class*="baseArticleTags"]')).not.toBe(null)
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('デフォルトの articleTag', () => {
      beforeEach(() => {
        result = render(<BaseArticle {...defaultProps} />)
      })

      test('article タグで出力される', () => {
        const article = result.container.querySelector('article')
        expect(article).not.toBe(null)
      })
    })

    describe('articleTag を指定した場合', () => {
      beforeEach(() => {
        result = render(<BaseArticle {...defaultProps} articleTag="section" />)
      })

      test('指定したタグで出力される', () => {
        const section = result.container.querySelector('section')
        expect(section).not.toBe(null)
      })

      test('article タグは出力されない', () => {
        const article = result.container.querySelector('article')
        expect(article).toBe(null)
      })
    })

    describe('クラス名', () => {
      beforeEach(() => {
        result = render(<BaseArticle {...defaultProps} className="custom-class" />)
      })

      test('baseArticle クラスが付与される', () => {
        const wrapper = result.container.firstElementChild
        expect(wrapper?.className).toContain('baseArticle')
      })

      test('カスタムクラス名が付与される', () => {
        const wrapper = result.container.firstElementChild
        expect(wrapper?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('className を省略した場合', () => {
      beforeEach(() => {
        result = render(<BaseArticle {...defaultProps} />)
      })

      test('baseArticle クラスのみ付与される', () => {
        const wrapper = result.container.firstElementChild
        expect(wrapper?.className).toContain('baseArticle')
      })
    })

    describe('内部構造', () => {
      beforeEach(() => {
        result = render(<BaseArticle {...defaultProps} />)
      })

      test('baseArticle_container クラスを持つ要素が存在する', () => {
        const container = result.container.querySelector('div[class*="baseArticle_container"]')
        expect(container).not.toBe(null)
      })

      test('baseArticleTitle クラスを持つ要素が存在する', () => {
        const title = result.container.querySelector('div[class*="baseArticleTitle"]')
        expect(title).not.toBe(null)
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
