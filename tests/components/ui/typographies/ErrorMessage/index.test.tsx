import { render, type RenderResult, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { ErrorMessage } from '~/components/ui/typographies/ErrorMessage'

describe('ErrorMessage', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('基本的なテキスト', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ErrorMessage text="エラーメッセージ" />
          </MemoryRouter>
        )
      })

      test('text が正常に出力されている', () => {
        const text = result.container.querySelector('span')
        expect(text).not.toBe(null)
        expect(text?.textContent).toBe('エラーメッセージ')
      })

      test('デフォルトで span タグが使用されている', () => {
        const span = result.container.querySelector('span')
        expect(span).not.toBe(null)
      })
    })

    describe('カスタムテキストタグ', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ErrorMessage text="エラーメッセージ" textTag="p" />
          </MemoryRouter>
        )
      })

      test('指定したタグ（p）が使用されている', () => {
        const p = result.container.querySelector('p')
        expect(p).not.toBe(null)
        expect(p?.textContent).toBe('エラーメッセージ')
      })

      test('span タグは使用されていない', () => {
        const span = result.container.querySelector('span')
        expect(span).toBe(null)
      })
    })

    describe('ReactNode を text に渡した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ErrorMessage text={<span data-testid="custom-text">カスタムエラー</span>} />
          </MemoryRouter>
        )
      })

      test('ReactNode が正常に出力されている', () => {
        const customText = result.getByTestId('custom-text')
        expect(customText).not.toBe(null)
        expect(customText.textContent).toBe('カスタムエラー')
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
            <ErrorMessage text="エラーメッセージ" />
          </MemoryRouter>
        )
      })

      test('errorMessage クラスが適用されている', () => {
        const errorMessage = result.container.querySelector('span[class*="errorMessage"]')
        expect(errorMessage?.className).toContain('errorMessage')
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <ErrorMessage text="エラーメッセージ" className="custom-class" />
          </MemoryRouter>
        )
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const errorMessage = result.container.querySelector('span[class*="errorMessage"]')
        expect(errorMessage?.classList.contains('custom-class')).toBe(true)
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
