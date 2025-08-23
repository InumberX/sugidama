import { render, type RenderResult, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'

describe('PrimitiveButton', () => {
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
    describe('標準ボタン', () => {
      beforeEach(() => {
        result = render(<PrimitiveButton onClick={() => handleClick()}>test</PrimitiveButton>)
      })

      test('children が正常に出力されている', () => {
        const button = result.container.querySelector('button')
        expect(button).not.toBe(null)
        expect(button?.textContent).toBe('test')
      })

      test('type が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('type')).toEqual('button')
      })
    })

    describe('submitボタン', () => {
      beforeEach(() => {
        result = render(
          <PrimitiveButton buttonType="submit" onClick={() => handleClick()}>
            test
          </PrimitiveButton>
        )
      })

      test('type が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('type')).toEqual('submit')
      })
    })

    describe('name と value 属性', () => {
      beforeEach(() => {
        result = render(
          <PrimitiveButton name="testName" value="testValue">
            test
          </PrimitiveButton>
        )
      })

      test('name と value 属性が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('name')).toEqual('testName')
        expect(button?.getAttribute('value')).toEqual('testValue')
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('非活性ボタン', () => {
      beforeEach(() => {
        result = render(
          <PrimitiveButton onClick={() => handleClick()} isDisabled>
            test
          </PrimitiveButton>
        )
      })

      test('disabled 属性が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('disabled')).toEqual('')
      })

      test('非活性スタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('primitiveButton__disabled')
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(<PrimitiveButton className="custom-class">test</PrimitiveButton>)
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.classList.contains('custom-class')).toBe(true)
      })
    })
  })

  //============================================================================
  // 3. Operation
  //============================================================================
  describe('Operation', () => {
    describe('クリックイベント', () => {
      beforeEach(() => {
        result = render(<PrimitiveButton onClick={() => handleClick()}>test</PrimitiveButton>)
      })

      test('クリックイベントが正常に動作している', () => {
        const button = result.container.querySelector('button')

        if (!button) {
          throw new Error('The target element was not found.')
        }

        fireEvent.click(button)
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })

    describe('内部リンクボタン', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <PrimitiveButton url="/internal/path">test</PrimitiveButton>
          </MemoryRouter>
        )
      })

      test('Link コンポーネントが使用されている', () => {
        const link = result.container.querySelector('a')
        expect(link).not.toBe(null)
        expect(link?.getAttribute('href')).toEqual('/internal/path')
      })
    })

    describe('外部リンクボタン（https）', () => {
      beforeEach(() => {
        result = render(<PrimitiveButton url="https://example.com">test</PrimitiveButton>)
      })

      test('a タグが使用されている', () => {
        const link = result.container.querySelector('a')
        expect(link).not.toBe(null)
        expect(link?.getAttribute('href')).toEqual('https://example.com')
      })
    })

    describe('外部リンクボタン（http）', () => {
      beforeEach(() => {
        result = render(<PrimitiveButton url="http://example.com">test</PrimitiveButton>)
      })

      test('a タグが使用されている', () => {
        const link = result.container.querySelector('a')
        expect(link).not.toBe(null)
        expect(link?.getAttribute('href')).toEqual('http://example.com')
      })
    })

    describe('別タブで開く外部リンクボタン', () => {
      beforeEach(() => {
        result = render(
          <PrimitiveButton url="https://example.com" target="_blank" rel="noopener">
            test
          </PrimitiveButton>
        )
      })

      test('target と rel 属性が正常に付与されている', () => {
        const link = result.container.querySelector('a')
        expect(link?.getAttribute('target')).toEqual('_blank')
        expect(link?.getAttribute('rel')).toEqual('noopener')
      })
    })

    describe('リンクボタンのクリックイベント', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <PrimitiveButton url="/internal/path" onClick={() => handleClick()}>
              test
            </PrimitiveButton>
          </MemoryRouter>
        )
      })

      test('リンククリック時にイベントが発火する', () => {
        const link = result.container.querySelector('a')

        if (!link) {
          throw new Error('The target element was not found.')
        }

        fireEvent.click(link)
        expect(handleClick).toHaveBeenCalledTimes(1)
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
