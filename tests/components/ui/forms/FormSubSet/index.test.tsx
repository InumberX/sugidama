import { render, type RenderResult, cleanup } from '@testing-library/react'
import { describe, vi, afterEach, test, expect, beforeEach } from 'vitest'

import { FormSubSet } from '~/components/ui/forms/FormSubSet'

describe('FormSubSet', () => {
  let result: RenderResult

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
        result = render(
          <FormSubSet title="ラベル">
            <input type="text" />
          </FormSubSet>
        )
      })

      test('dl 要素が出力されている', () => {
        const dl = result.container.querySelector('dl')
        expect(dl).not.toBe(null)
      })

      test('dt 要素に title が出力されている', () => {
        const dt = result.container.querySelector('dt')
        expect(dt).not.toBe(null)
        expect(dt?.textContent).toContain('ラベル')
      })

      test('dd 要素に children が出力されている', () => {
        const dd = result.container.querySelector('dd')
        expect(dd).not.toBe(null)
        const input = dd?.querySelector('input')
        expect(input).not.toBe(null)
      })
    })

    describe('children なしの場合', () => {
      beforeEach(() => {
        result = render(<FormSubSet title="ラベル" />)
      })

      test('dd 要素は空で出力される', () => {
        const dd = result.container.querySelector('dd')
        expect(dd).not.toBe(null)
        expect(dd?.textContent).toBe('')
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('isFirst が true の場合', () => {
      beforeEach(() => {
        result = render(
          <FormSubSet title="ラベル" isFirst>
            <input type="text" />
          </FormSubSet>
        )
      })

      test('first スタイルが適用されている', () => {
        const dl = result.container.querySelector('dl')
        expect(dl?.className).toContain('formSubSet__first')
      })
    })

    describe('isLast が true の場合', () => {
      beforeEach(() => {
        result = render(
          <FormSubSet title="ラベル" isLast>
            <input type="text" />
          </FormSubSet>
        )
      })

      test('last スタイルが適用されている', () => {
        const dl = result.container.querySelector('dl')
        expect(dl?.className).toContain('formSubSet__last')
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <FormSubSet title="ラベル" className="custom-class">
            <input type="text" />
          </FormSubSet>
        )
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const dl = result.container.querySelector('dl')
        expect(dl?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('内部構造', () => {
      beforeEach(() => {
        result = render(
          <FormSubSet title="ラベル">
            <input type="text" />
          </FormSubSet>
        )
      })

      test('formSubSet クラスが適用されている', () => {
        const dl = result.container.querySelector('dl')
        expect(dl?.className).toContain('formSubSet')
      })

      test('formSubSetTitle クラスを持つ dt 要素が存在する', () => {
        const dt = result.container.querySelector('dt[class*="formSubSetTitle"]')
        expect(dt).not.toBe(null)
      })

      test('formSubSetContents クラスを持つ dd 要素が存在する', () => {
        const dd = result.container.querySelector('dd[class*="formSubSetContents"]')
        expect(dd).not.toBe(null)
      })

      test('formSubSetTitle_text クラスを持つ div 要素が存在する', () => {
        const text = result.container.querySelector('div[class*="formSubSetTitle_text"]')
        expect(text).not.toBe(null)
        expect(text?.textContent).toBe('ラベル')
      })
    })

    describe('複数のスタイルプロパティ', () => {
      beforeEach(() => {
        result = render(
          <FormSubSet title="ラベル" isFirst isLast>
            <input type="text" />
          </FormSubSet>
        )
      })

      test('すべてのスタイルプロパティが同時に適用される', () => {
        const dl = result.container.querySelector('dl')
        expect(dl?.className).toContain('formSubSet__first')
        expect(dl?.className).toContain('formSubSet__last')
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
