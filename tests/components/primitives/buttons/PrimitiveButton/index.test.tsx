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

    describe('buttonType のみ指定（onClick なし）', () => {
      describe('submit ボタン', () => {
        beforeEach(() => {
          result = render(<PrimitiveButton buttonType="submit">test</PrimitiveButton>)
        })

        test('button 要素がレンダリングされる', () => {
          const button = result.container.querySelector('button')
          expect(button).not.toBe(null)
        })

        test('type="submit" が正常に付与されている', () => {
          const button = result.container.querySelector('button')
          expect(button?.getAttribute('type')).toEqual('submit')
        })

        test('span 要素はレンダリングされない', () => {
          const span = result.container.querySelector('span')
          expect(span).toBe(null)
        })
      })

      describe('reset ボタン', () => {
        beforeEach(() => {
          result = render(<PrimitiveButton buttonType="reset">test</PrimitiveButton>)
        })

        test('button 要素がレンダリングされる', () => {
          const button = result.container.querySelector('button')
          expect(button).not.toBe(null)
        })

        test('type="reset" が正常に付与されている', () => {
          const button = result.container.querySelector('button')
          expect(button?.getAttribute('type')).toEqual('reset')
        })

        test('span 要素はレンダリングされない', () => {
          const span = result.container.querySelector('span')
          expect(span).toBe(null)
        })
      })

      describe('button タイプ', () => {
        beforeEach(() => {
          result = render(<PrimitiveButton buttonType="button">test</PrimitiveButton>)
        })

        test('button 要素がレンダリングされる', () => {
          const button = result.container.querySelector('button')
          expect(button).not.toBe(null)
        })

        test('type="button" が正常に付与されている', () => {
          const button = result.container.querySelector('button')
          expect(button?.getAttribute('type')).toEqual('button')
        })
      })
    })

    describe('onClick も buttonType も指定しない場合', () => {
      beforeEach(() => {
        result = render(<PrimitiveButton>test</PrimitiveButton>)
      })

      test('span 要素がレンダリングされる', () => {
        const span = result.container.querySelector('span')
        expect(span).not.toBe(null)
        expect(span?.textContent).toBe('test')
      })

      test('button 要素はレンダリングされない', () => {
        const button = result.container.querySelector('button')
        expect(button).toBe(null)
      })
    })

    describe('name と value 属性', () => {
      beforeEach(() => {
        result = render(
          <PrimitiveButton name="testName" value="testValue" onClick={() => handleClick()}>
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

    describe('title 属性', () => {
      beforeEach(() => {
        result = render(
          <PrimitiveButton onClick={() => handleClick()} title="クリックして保存">
            保存
          </PrimitiveButton>
        )
      })

      test('title が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('title')).toEqual('クリックして保存')
      })
    })

    describe('ARIA 属性', () => {
      describe('aria-label', () => {
        beforeEach(() => {
          result = render(
            <PrimitiveButton onClick={() => handleClick()} ariaLabel="閉じる">
              ×
            </PrimitiveButton>
          )
        })

        test('aria-label が正常に付与されている', () => {
          const button = result.container.querySelector('button')
          expect(button?.getAttribute('aria-label')).toEqual('閉じる')
        })
      })

      describe('aria-controls', () => {
        beforeEach(() => {
          result = render(
            <PrimitiveButton onClick={() => handleClick()} ariaControls="menu-1">
              Menu
            </PrimitiveButton>
          )
        })

        test('aria-controls が正常に付与されている', () => {
          const button = result.container.querySelector('button')
          expect(button?.getAttribute('aria-controls')).toEqual('menu-1')
        })
      })

      describe('aria-selected', () => {
        beforeEach(() => {
          result = render(
            <PrimitiveButton onClick={() => handleClick()} ariaSelected="true">
              Tab 1
            </PrimitiveButton>
          )
        })

        test('aria-selected が正常に付与されている', () => {
          const button = result.container.querySelector('button')
          expect(button?.getAttribute('aria-selected')).toEqual('true')
        })
      })
    })

    describe('role 属性', () => {
      beforeEach(() => {
        result = render(
          <PrimitiveButton onClick={() => handleClick()} role="tab">
            Tab
          </PrimitiveButton>
        )
      })

      test('role が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('role')).toEqual('tab')
      })
    })

    describe('tabIndex 属性', () => {
      beforeEach(() => {
        result = render(
          <PrimitiveButton onClick={() => handleClick()} tabIndex={-1}>
            Button
          </PrimitiveButton>
        )
      })

      test('tabIndex が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('tabindex')).toEqual('-1')
      })
    })

    describe('複数の ARIA 属性', () => {
      beforeEach(() => {
        result = render(
          <PrimitiveButton
            onClick={() => handleClick()}
            role="tab"
            ariaLabel="ホームタブ"
            ariaControls="panel-1"
            ariaSelected="true"
          >
            Home
          </PrimitiveButton>
        )
      })

      test('複数の ARIA 属性が同時に付与される', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('role')).toEqual('tab')
        expect(button?.getAttribute('aria-label')).toEqual('ホームタブ')
        expect(button?.getAttribute('aria-controls')).toEqual('panel-1')
        expect(button?.getAttribute('aria-selected')).toEqual('true')
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
        result = render(
          <PrimitiveButton className="custom-class" onClick={() => handleClick()}>
            test
          </PrimitiveButton>
        )
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

    describe('ハッシュリンクボタン', () => {
      beforeEach(() => {
        result = render(<PrimitiveButton url="#section-1">test</PrimitiveButton>)
      })

      test('a タグが使用されている', () => {
        const link = result.container.querySelector('a')
        expect(link).not.toBe(null)
        expect(link?.getAttribute('href')).toEqual('#section-1')
      })

      test('button 要素はレンダリングされない', () => {
        const button = result.container.querySelector('button')
        expect(button).toBe(null)
      })
    })

    describe('url と onClick の併用', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <PrimitiveButton url="/path" onClick={() => handleClick()}>
              test
            </PrimitiveButton>
          </MemoryRouter>
        )
      })

      test('url がある場合はリンク要素になる', () => {
        const link = result.container.querySelector('a')
        const button = result.container.querySelector('button')

        expect(link).not.toBe(null)
        expect(button).toBe(null)
      })

      test('onClick も正常に動作する', () => {
        const link = result.container.querySelector('a')

        if (!link) {
          throw new Error('The target element was not found.')
        }

        fireEvent.click(link)
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })

    describe('非活性ボタンのクリック', () => {
      beforeEach(() => {
        result = render(
          <PrimitiveButton onClick={() => handleClick()} isDisabled>
            test
          </PrimitiveButton>
        )
      })

      test('非活性状態ではクリックイベントが発火しない', () => {
        const button = result.container.querySelector('button')

        if (!button) {
          throw new Error('The target element was not found.')
        }

        fireEvent.click(button)
        // disabled なのでハンドラーは呼ばれない
        expect(handleClick).not.toHaveBeenCalled()
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
