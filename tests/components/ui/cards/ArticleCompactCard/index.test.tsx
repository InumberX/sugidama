import { render, type RenderResult, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { ArticleCompactCard } from '~/components/ui/cards/ArticleCompactCard'

describe('ArticleCompactCard', () => {
  let result: RenderResult
  const handleClick: () => void = vi.fn()

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('基本的なカード', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'テスト記事タイトル' }} />
          </MemoryRouter>
        )
      })

      test('title が正常に出力されている', () => {
        const title = result.container.querySelector('h2')
        expect(title).not.toBe(null)
        expect(title?.textContent).toBe('テスト記事タイトル')
      })

      test('デフォルトで article タグが使用されている', () => {
        const article = result.container.querySelector('article')
        expect(article).not.toBe(null)
      })

      test('デフォルトで h2 タグがタイトルに使用されている', () => {
        const h2 = result.container.querySelector('h2')
        expect(h2).not.toBe(null)
      })
    })

    describe('description がある場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル' }} description={{ text: 'これは説明文です' }} />
          </MemoryRouter>
        )
      })

      test('description が正常に出力されている', () => {
        const description = result.container.querySelector('p')
        expect(description).not.toBe(null)
        expect(description?.textContent).toBe('これは説明文です')
      })
    })

    describe('description がない場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル' }} />
          </MemoryRouter>
        )
      })

      test('description の p タグは出力されていない', () => {
        const paragraphs = result.container.querySelectorAll('p')
        expect(paragraphs.length).toBe(0)
      })
    })

    describe('tags がある場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard
              title={{ text: 'タイトル' }}
              tags={[{ children: 'タグ1' }, { children: 'タグ2' }, { children: 'タグ3' }]}
            />
          </MemoryRouter>
        )
      })

      test('tags が正常に出力されている', () => {
        const tags = result.container.querySelectorAll('li')
        expect(tags.length).toBe(3)
      })

      test('各タグのテキストが正しい', () => {
        expect(result.container.textContent).toContain('タグ1')
        expect(result.container.textContent).toContain('タグ2')
        expect(result.container.textContent).toContain('タグ3')
      })
    })

    describe('tags が空の場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル' }} tags={[]} />
          </MemoryRouter>
        )
      })

      test('tags 領域は出力されていない', () => {
        const tagsContainer = result.container.querySelector('div[class*="articleCompactCardTags"]')
        expect(tagsContainer).toBe(null)
      })
    })

    describe('thumbnail がある場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard
              title={{ text: 'タイトル' }}
              thumbnail={{ src: '/test-image.jpg', alt: 'テスト画像' }}
            />
          </MemoryRouter>
        )
      })

      test('thumbnail の img タグが正常に出力されている', () => {
        const img = result.container.querySelector('img')
        expect(img).not.toBe(null)
        expect(img?.getAttribute('src')).toBe('/test-image.jpg')
        expect(img?.getAttribute('alt')).toBe('テスト画像')
      })
    })

    describe('thumbnail がない場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル' }} />
          </MemoryRouter>
        )
      })

      test('デフォルト画像が使用されている', () => {
        const img = result.container.querySelector('img')
        expect(img).not.toBe(null)
        expect(img?.getAttribute('src')).toContain('img-empty-16-9.avif')
      })

      test('alt は空文字が設定されている', () => {
        const img = result.container.querySelector('img')
        expect(img?.getAttribute('alt')).toBe('')
      })
    })

    describe('カスタム titleTag', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル', titleTag: 'h3' }} />
          </MemoryRouter>
        )
      })

      test('指定した titleTag が使用されている', () => {
        const h3 = result.container.querySelector('h3')
        expect(h3).not.toBe(null)
        expect(h3?.textContent).toBe('タイトル')
      })

      test('デフォルトの h2 は使用されていない', () => {
        const h2 = result.container.querySelector('h2')
        expect(h2).toBe(null)
      })
    })

    describe('カスタム articleTag', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル' }} articleTag="section" />
          </MemoryRouter>
        )
      })

      test('指定した articleTag が使用されている', () => {
        const section = result.container.querySelector('section')
        expect(section).not.toBe(null)
      })

      test('デフォルトの article は使用されていない', () => {
        const article = result.container.querySelector('article')
        expect(article).toBe(null)
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
            <ArticleCompactCard title={{ text: 'タイトル' }} />
          </MemoryRouter>
        )
      })

      test('articleCompactCard クラスが適用されている', () => {
        const article = result.container.querySelector('article')
        expect(article?.className).toContain('articleCompactCard')
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル' }} className="custom-class" />
          </MemoryRouter>
        )
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const article = result.container.querySelector('article')
        expect(article?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('button に url がある場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル' }} button={{ url: '/path' }} />
          </MemoryRouter>
        )
      })

      test('clickable クラスが適用されている', () => {
        const titleLink = result.container.querySelector('h2 a')
        expect(titleLink?.className).toContain('articleCompactCard_clickable')
      })
    })

    describe('button に onClick がある場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル' }} button={{ onClick: () => handleClick() }} />
          </MemoryRouter>
        )
      })

      test('clickable クラスが適用されている', () => {
        const titleButton = result.container.querySelector('h2 button')
        expect(titleButton?.className).toContain('articleCompactCard_clickable')
      })
    })

    describe('button がない場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル' }} />
          </MemoryRouter>
        )
      })

      test('タイトルに clickable クラスは適用されない', () => {
        const titleSpan = result.container.querySelector('h2 span')
        expect(titleSpan?.className).not.toContain('articleCompactCard_clickable')
      })
    })

    describe('内部構造', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard
              title={{ text: 'タイトル' }}
              description={{ text: '説明' }}
              tags={[{ children: 'タグ' }]}
            />
          </MemoryRouter>
        )
      })

      test('articleCompactCardTitle クラスを持つ要素が存在する', () => {
        const title = result.container.querySelector('h2[class*="articleCompactCardTitle"]')
        expect(title).not.toBe(null)
      })

      test('articleCompactCardDescription クラスを持つ要素が存在する', () => {
        const description = result.container.querySelector('p[class*="articleCompactCardDescription"]')
        expect(description).not.toBe(null)
      })

      test('articleCompactCardTags クラスを持つ要素が存在する', () => {
        const tags = result.container.querySelector('div[class*="articleCompactCardTags"]')
        expect(tags).not.toBe(null)
      })

      test('articleCompactCardThumbnail クラスを持つ要素が存在する', () => {
        const thumbnail = result.container.querySelector('div[class*="articleCompactCardThumbnail"]')
        expect(thumbnail).not.toBe(null)
      })
    })

    describe('tags に outlined バリアントが適用される', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル' }} tags={[{ children: 'タグ' }]} />
          </MemoryRouter>
        )
      })

      test('タグに outlined スタイルが適用されている', () => {
        const tag = result.container.querySelector('span[class*="baseTag"]')
        expect(tag?.className).toContain('baseTag__outlined')
      })
    })
  })

  //============================================================================
  // 3. Operation
  //============================================================================
  describe('Operation', () => {
    describe('内部リンクカード', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル' }} button={{ url: '/internal/path' }} />
          </MemoryRouter>
        )
      })

      test('タイトルに Link コンポーネントが使用されている', () => {
        const link = result.container.querySelector('h2 a')
        expect(link).not.toBe(null)
        expect(link?.getAttribute('href')).toEqual('/internal/path')
      })

      test('サムネイルにも Link コンポーネントが使用されている', () => {
        const thumbnailLink = result.container.querySelector('div[class*="articleCompactCardThumbnail"] a')
        expect(thumbnailLink).not.toBe(null)
        expect(thumbnailLink?.getAttribute('href')).toEqual('/internal/path')
      })
    })

    describe('外部リンクカード', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル' }} button={{ url: 'https://example.com' }} />
          </MemoryRouter>
        )
      })

      test('タイトルに a タグが使用されている', () => {
        const link = result.container.querySelector('h2 a')
        expect(link).not.toBe(null)
        expect(link?.getAttribute('href')).toEqual('https://example.com')
      })

      test('サムネイルにも a タグが使用されている', () => {
        const thumbnailLink = result.container.querySelector('div[class*="articleCompactCardThumbnail"] a')
        expect(thumbnailLink).not.toBe(null)
        expect(thumbnailLink?.getAttribute('href')).toEqual('https://example.com')
      })
    })

    describe('クリックイベントカード', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル' }} button={{ onClick: () => handleClick() }} />
          </MemoryRouter>
        )
      })

      test('タイトルのクリックイベントが正常に動作している', () => {
        const button = result.container.querySelector('h2 button')

        if (!button) {
          throw new Error('The target element was not found.')
        }

        fireEvent.click(button)
        expect(handleClick).toHaveBeenCalledTimes(1)
      })

      test('サムネイルのクリックイベントが正常に動作している', () => {
        vi.clearAllMocks()
        const thumbnailButton = result.container.querySelector('div[class*="articleCompactCardThumbnail"] button')

        if (!thumbnailButton) {
          throw new Error('The target element was not found.')
        }

        fireEvent.click(thumbnailButton)
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })

    describe('description ありのクリックイベントカード', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard
              title={{ text: 'タイトル' }}
              description={{ text: '説明文' }}
              button={{ onClick: () => handleClick() }}
            />
          </MemoryRouter>
        )
      })

      test('description のクリックイベントが正常に動作している', () => {
        const descButton = result.container.querySelector('p button')

        if (!descButton) {
          throw new Error('The target element was not found.')
        }

        fireEvent.click(descButton)
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })

    describe('description ありのリンクカード', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard
              title={{ text: 'タイトル' }}
              description={{ text: '説明文' }}
              button={{ url: '/path' }}
            />
          </MemoryRouter>
        )
      })

      test('description にも Link コンポーネントが使用されている', () => {
        const descLink = result.container.querySelector('p a')
        expect(descLink).not.toBe(null)
        expect(descLink?.getAttribute('href')).toEqual('/path')
      })
    })

    describe('button がないカード', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ArticleCompactCard title={{ text: 'タイトル' }} />
          </MemoryRouter>
        )
      })

      test('タイトルは span 要素で出力される', () => {
        const titleSpan = result.container.querySelector('h2 span')
        expect(titleSpan).not.toBe(null)
      })

      test('リンクやボタン要素は存在しない', () => {
        const links = result.container.querySelectorAll('a')
        const buttons = result.container.querySelectorAll('button')
        expect(links.length).toBe(0)
        expect(buttons.length).toBe(0)
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
