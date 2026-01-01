import { render, type RenderResult, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { PageTitle } from '~/components/ui/typographies/PageTitle'

describe('PageTitle', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('基本的なタイトル', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <PageTitle title="テストタイトル" />
          </MemoryRouter>
        )
      })

      test('title が正常に出力されている', () => {
        const title = result.container.querySelector('h1')
        expect(title).not.toBe(null)
        expect(title?.textContent).toBe('テストタイトル')
      })

      test('デフォルトで h1 タグが使用されている', () => {
        const h1 = result.container.querySelector('h1')
        expect(h1).not.toBe(null)
      })
    })

    describe('カスタムタイトルタグ', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <PageTitle title="テストタイトル" titleTag="h2" />
          </MemoryRouter>
        )
      })

      test('指定したタグ（h2）が使用されている', () => {
        const h2 = result.container.querySelector('h2')
        expect(h2).not.toBe(null)
        expect(h2?.textContent).toBe('テストタイトル')
      })

      test('h1 タグは使用されていない', () => {
        const h1 = result.container.querySelector('h1')
        expect(h1).toBe(null)
      })
    })

    describe('ReactNode を title に渡した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <PageTitle title={<span data-testid="custom-title">カスタムタイトル</span>} />
          </MemoryRouter>
        )
      })

      test('ReactNode が正常に出力されている', () => {
        const customTitle = result.getByTestId('custom-title')
        expect(customTitle).not.toBe(null)
        expect(customTitle.textContent).toBe('カスタムタイトル')
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
            <PageTitle title="テストタイトル" />
          </MemoryRouter>
        )
      })

      test('pageTitle クラスが適用されている', () => {
        const pageTitle = result.container.querySelector('div[class*="pageTitle"]')
        expect(pageTitle?.className).toContain('pageTitle')
      })
    })

    describe('デフォルトカラー（dark）', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <PageTitle title="テストタイトル" />
          </MemoryRouter>
        )
      })

      test('dark カラースタイルが適用されている', () => {
        const pageTitle = result.container.querySelector('div[class*="pageTitle"]')
        expect(pageTitle?.className).toContain('pageTitle__dark')
      })
    })

    describe('primary カラー', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <PageTitle title="テストタイトル" color="primary" />
          </MemoryRouter>
        )
      })

      test('primary カラースタイルが適用されている', () => {
        const pageTitle = result.container.querySelector('div[class*="pageTitle"]')
        expect(pageTitle?.className).toContain('pageTitle__primary')
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <PageTitle title="テストタイトル" className="custom-class" />
          </MemoryRouter>
        )
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const pageTitle = result.container.querySelector('div[class*="pageTitle"]')
        expect(pageTitle?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('isWrap が false の場合（デフォルト）', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <PageTitle title="テストタイトル" />
          </MemoryRouter>
        )
      })

      test('wrapper 要素は存在しない', () => {
        const wrapper = result.container.querySelector('div[class*="pageTitle_wrapper"]')
        expect(wrapper).toBe(null)
      })

      test('contents 要素が直接出力されている', () => {
        const contents = result.container.querySelector('div[class*="pageTitle_contents"]')
        expect(contents).not.toBe(null)
      })
    })

    describe('isWrap が true の場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <PageTitle title="テストタイトル" isWrap />
          </MemoryRouter>
        )
      })

      test('wrapper 要素が存在する', () => {
        const wrapper = result.container.querySelector('div[class*="pageTitle_wrapper"]')
        expect(wrapper).not.toBe(null)
      })

      test('container 要素が存在する', () => {
        const container = result.container.querySelector('div[class*="pageTitle_container"]')
        expect(container).not.toBe(null)
      })

      test('contents 要素が存在する', () => {
        const contents = result.container.querySelector('div[class*="pageTitle_contents"]')
        expect(contents).not.toBe(null)
      })
    })

    describe('内部構造', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <PageTitle title="テストタイトル" />
          </MemoryRouter>
        )
      })

      test('pageTitle_contents クラスを持つ div 要素が存在する', () => {
        const contents = result.container.querySelector('div[class*="pageTitle_contents"]')
        expect(contents).not.toBe(null)
      })

      test('pageTitle_paragraph クラスを持つ要素が存在する', () => {
        const paragraph = result.container.querySelector('[class*="pageTitle_paragraph"]')
        expect(paragraph).not.toBe(null)
      })

      test('pageTitle_text クラスを持つ span 要素が存在する', () => {
        const text = result.container.querySelector('span[class*="pageTitle_text"]')
        expect(text).not.toBe(null)
        expect(text?.textContent).toBe('テストタイトル')
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
