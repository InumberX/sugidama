import { render, type RenderResult, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { SectionTitle } from '~/components/ui/typographies/SectionTitle'

describe('SectionTitle', () => {
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
            <SectionTitle title="テストタイトル" />
          </MemoryRouter>
        )
      })

      test('title が正常に出力されている', () => {
        const title = result.container.querySelector('h2')
        expect(title).not.toBe(null)
        expect(title?.textContent).toBe('テストタイトル')
      })

      test('デフォルトで h2 タグが使用されている', () => {
        const h2 = result.container.querySelector('h2')
        expect(h2).not.toBe(null)
      })
    })

    describe('カスタムタイトルタグ', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <SectionTitle title="テストタイトル" titleTag="h3" />
          </MemoryRouter>
        )
      })

      test('指定したタグ（h3）が使用されている', () => {
        const h3 = result.container.querySelector('h3')
        expect(h3).not.toBe(null)
        expect(h3?.textContent).toBe('テストタイトル')
      })

      test('h2 タグは使用されていない', () => {
        const h2 = result.container.querySelector('h2')
        expect(h2).toBe(null)
      })
    })

    describe('ReactNode を title に渡した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <SectionTitle title={<span data-testid="custom-title">カスタムタイトル</span>} />
          </MemoryRouter>
        )
      })

      test('ReactNode が正常に出力されている', () => {
        const customTitle = result.getByTestId('custom-title')
        expect(customTitle).not.toBe(null)
        expect(customTitle.textContent).toBe('カスタムタイトル')
      })
    })

    describe('id を渡した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <SectionTitle title="テストタイトル" id="section-id" />
          </MemoryRouter>
        )
      })

      test('id がタイトルタグに設定されている', () => {
        const title = result.container.querySelector('#section-id')
        expect(title).not.toBe(null)
        expect(title?.tagName.toLowerCase()).toBe('h2')
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
            <SectionTitle title="テストタイトル" />
          </MemoryRouter>
        )
      })

      test('sectionTitle クラスが適用されている', () => {
        const sectionTitle = result.container.querySelector('div[class*="sectionTitle"]')
        expect(sectionTitle?.className).toContain('sectionTitle')
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <SectionTitle title="テストタイトル" className="custom-class" />
          </MemoryRouter>
        )
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const sectionTitle = result.container.querySelector('div[class*="sectionTitle"]')
        expect(sectionTitle?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('内部構造', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <SectionTitle title="テストタイトル" />
          </MemoryRouter>
        )
      })

      test('sectionTitle_container クラスを持つ div 要素が存在する', () => {
        const container = result.container.querySelector('div[class*="sectionTitle_container"]')
        expect(container).not.toBe(null)
      })

      test('sectionTitle_divider クラスを持つ span 要素が存在する', () => {
        const divider = result.container.querySelector('span[class*="sectionTitle_divider"]')
        expect(divider).not.toBe(null)
      })

      test('sectionTitle_text クラスを持つ要素が存在する', () => {
        const text = result.container.querySelector('[class*="sectionTitle_text"]')
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
