import { render, type RenderResult, cleanup } from '@testing-library/react'
import { describe, vi, afterEach, test, expect, beforeEach } from 'vitest'

import { FormSet } from '~/components/ui/forms/FormSet'

describe('FormSet', () => {
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
          <FormSet title="ラベル">
            <input type="text" />
          </FormSet>
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

    describe('id が指定されている場合', () => {
      beforeEach(() => {
        result = render(
          <FormSet title="ラベル" id="test-id">
            <input type="text" />
          </FormSet>
        )
      })

      test('dt 要素に id が付与されている', () => {
        const dt = result.container.querySelector('dt')
        expect(dt?.getAttribute('id')).toEqual('test-id')
      })
    })

    describe('subTitle が指定されている場合', () => {
      beforeEach(() => {
        result = render(
          <FormSet title="ラベル" subTitle="サブタイトル">
            <input type="text" />
          </FormSet>
        )
      })

      test('subTitle が出力されている', () => {
        const dt = result.container.querySelector('dt')
        expect(dt?.textContent).toContain('サブタイトル')
      })
    })

    describe('subTitle が指定されていない場合', () => {
      beforeEach(() => {
        result = render(
          <FormSet title="ラベル">
            <input type="text" />
          </FormSet>
        )
      })

      test('subTitle 要素は出力されていない', () => {
        const sub = result.container.querySelector('div[class*="formSetTitle_sub"]')
        expect(sub).toBe(null)
      })
    })

    describe('isRequired が true の場合', () => {
      beforeEach(() => {
        result = render(
          <FormSet title="ラベル" isRequired>
            <input type="text" />
          </FormSet>
        )
      })

      test('必須ラベルが出力されている', () => {
        const required = result.container.querySelector('span[class*="formSetTitleRequired"]')
        expect(required).not.toBe(null)
        expect(required?.textContent).toBe('必須')
      })
    })

    describe('isRequired が指定されていない場合', () => {
      beforeEach(() => {
        result = render(
          <FormSet title="ラベル">
            <input type="text" />
          </FormSet>
        )
      })

      test('必須ラベルは出力されていない', () => {
        const required = result.container.querySelector('span[class*="formSetTitleRequired"]')
        expect(required).toBe(null)
      })
    })

    describe('children なしの場合', () => {
      beforeEach(() => {
        result = render(<FormSet title="ラベル" />)
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
    describe('デフォルトサイズ（medium）', () => {
      beforeEach(() => {
        result = render(
          <FormSet title="ラベル">
            <input type="text" />
          </FormSet>
        )
      })

      test('medium サイズスタイルが適用されている', () => {
        const dl = result.container.querySelector('dl')
        expect(dl?.className).toContain('formSet__medium')
      })
    })

    describe('small サイズ', () => {
      beforeEach(() => {
        result = render(
          <FormSet title="ラベル" size="small">
            <input type="text" />
          </FormSet>
        )
      })

      test('small サイズスタイルが適用されている', () => {
        const dl = result.container.querySelector('dl')
        expect(dl?.className).toContain('formSet__small')
      })
    })

    describe('isFirst が true の場合', () => {
      beforeEach(() => {
        result = render(
          <FormSet title="ラベル" isFirst>
            <input type="text" />
          </FormSet>
        )
      })

      test('first スタイルが適用されている', () => {
        const dl = result.container.querySelector('dl')
        expect(dl?.className).toContain('formSet__first')
      })
    })

    describe('isLast が true の場合', () => {
      beforeEach(() => {
        result = render(
          <FormSet title="ラベル" isLast>
            <input type="text" />
          </FormSet>
        )
      })

      test('last スタイルが適用されている', () => {
        const dl = result.container.querySelector('dl')
        expect(dl?.className).toContain('formSet__last')
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <FormSet title="ラベル" className="custom-class">
            <input type="text" />
          </FormSet>
        )
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const dl = result.container.querySelector('dl')
        expect(dl?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('isTitleVertical が true の場合', () => {
      beforeEach(() => {
        result = render(
          <FormSet title="ラベル" isTitleVertical>
            <input type="text" />
          </FormSet>
        )
      })

      test('vertical スタイルが適用されている', () => {
        const container = result.container.querySelector('div[class*="formSetTitle_container"]')
        expect(container?.className).toContain('formSetTitle_container__vertical')
      })
    })

    describe('isTitleVertical が指定されていない場合', () => {
      beforeEach(() => {
        result = render(
          <FormSet title="ラベル">
            <input type="text" />
          </FormSet>
        )
      })

      test('vertical スタイルが適用されていない', () => {
        const container = result.container.querySelector('div[class*="formSetTitle_container"]')
        expect(container?.className).not.toContain('formSetTitle_container__vertical')
      })
    })

    describe('内部構造', () => {
      beforeEach(() => {
        result = render(
          <FormSet title="ラベル">
            <input type="text" />
          </FormSet>
        )
      })

      test('formSet クラスが適用されている', () => {
        const dl = result.container.querySelector('dl')
        expect(dl?.className).toContain('formSet')
      })

      test('formSetTitle クラスを持つ dt 要素が存在する', () => {
        const dt = result.container.querySelector('dt[class*="formSetTitle"]')
        expect(dt).not.toBe(null)
      })

      test('formSetContents クラスを持つ dd 要素が存在する', () => {
        const dd = result.container.querySelector('dd[class*="formSetContents"]')
        expect(dd).not.toBe(null)
      })

      test('formSetTitle_text クラスを持つ div 要素が存在する', () => {
        const text = result.container.querySelector('div[class*="formSetTitle_text"]')
        expect(text).not.toBe(null)
        expect(text?.textContent).toBe('ラベル')
      })
    })

    describe('複数のスタイルプロパティ', () => {
      beforeEach(() => {
        result = render(
          <FormSet title="ラベル" size="small" isFirst isLast>
            <input type="text" />
          </FormSet>
        )
      })

      test('すべてのスタイルプロパティが同時に適用される', () => {
        const dl = result.container.querySelector('dl')
        expect(dl?.className).toContain('formSet__small')
        expect(dl?.className).toContain('formSet__first')
        expect(dl?.className).toContain('formSet__last')
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
