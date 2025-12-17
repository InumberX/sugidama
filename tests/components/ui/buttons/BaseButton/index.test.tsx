import { render, type RenderResult, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { BaseButton } from '~/components/ui/buttons/BaseButton'

describe('BaseButton', () => {
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
        result = render(<BaseButton onClick={() => handleClick()}>test</BaseButton>)
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
          <BaseButton buttonType="submit" onClick={() => handleClick()}>
            test
          </BaseButton>
        )
      })

      test('type が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('type')).toEqual('submit')
      })
    })

    describe('leftElm と rightElm', () => {
      beforeEach(() => {
        result = render(
          <BaseButton
            onClick={() => handleClick()}
            leftElm={<span data-testid="left">Left</span>}
            rightElm={<span data-testid="right">Right</span>}
          >
            Center
          </BaseButton>
        )
      })

      test('leftElm が正常に出力されている', () => {
        const leftElm = result.getByTestId('left')
        expect(leftElm).not.toBe(null)
        expect(leftElm.textContent).toBe('Left')
      })

      test('rightElm が正常に出力されている', () => {
        const rightElm = result.getByTestId('right')
        expect(rightElm).not.toBe(null)
        expect(rightElm.textContent).toBe('Right')
      })

      test('children が正常に出力されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.textContent).toContain('Center')
      })
    })

    describe('leftElm のみ', () => {
      beforeEach(() => {
        result = render(
          <BaseButton onClick={() => handleClick()} leftElm={<span data-testid="left">Icon</span>}>
            Button
          </BaseButton>
        )
      })

      test('leftElm が正常に出力されている', () => {
        const leftElm = result.getByTestId('left')
        expect(leftElm).not.toBe(null)
      })

      test('rightElm は出力されていない', () => {
        const rightElm = result.queryByTestId('right')
        expect(rightElm).toBe(null)
      })
    })

    describe('rightElm のみ', () => {
      beforeEach(() => {
        result = render(
          <BaseButton onClick={() => handleClick()} rightElm={<span data-testid="right">Arrow</span>}>
            Button
          </BaseButton>
        )
      })

      test('rightElm が正常に出力されている', () => {
        const rightElm = result.getByTestId('right')
        expect(rightElm).not.toBe(null)
      })

      test('leftElm は出力されていない', () => {
        const leftElm = result.queryByTestId('left')
        expect(leftElm).toBe(null)
      })
    })

    describe('ARIA 属性', () => {
      beforeEach(() => {
        result = render(
          <BaseButton onClick={() => handleClick()} ariaLabel="保存ボタン" role="button">
            保存
          </BaseButton>
        )
      })

      test('aria-label が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('aria-label')).toEqual('保存ボタン')
      })

      test('role が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('role')).toEqual('button')
      })
    })

    describe('children なしの場合', () => {
      beforeEach(() => {
        result = render(<BaseButton onClick={() => handleClick()} />)
      })

      test('text 要素は空で出力される', () => {
        const text = result.container.querySelector('span[class*="baseButton_text"]')
        expect(text).not.toBe(null)
        expect(text?.textContent).toBe('')
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('デフォルトサイズ（medium）', () => {
      beforeEach(() => {
        result = render(<BaseButton onClick={() => handleClick()}>test</BaseButton>)
      })

      test('medium サイズスタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('baseButton__medium')
      })
    })

    describe('large サイズ', () => {
      beforeEach(() => {
        result = render(
          <BaseButton onClick={() => handleClick()} size="large">
            test
          </BaseButton>
        )
      })

      test('large サイズスタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('baseButton__large')
      })
    })

    describe('small サイズ', () => {
      beforeEach(() => {
        result = render(
          <BaseButton onClick={() => handleClick()} size="small">
            test
          </BaseButton>
        )
      })

      test('small サイズスタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('baseButton__small')
      })
    })

    describe('デフォルトバリアント（contained）', () => {
      beforeEach(() => {
        result = render(<BaseButton onClick={() => handleClick()}>test</BaseButton>)
      })

      test('contained バリアントスタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('baseButton__contained')
      })
    })

    describe('デフォルトカラー（primary）', () => {
      beforeEach(() => {
        result = render(<BaseButton onClick={() => handleClick()}>test</BaseButton>)
      })

      test('primary カラースタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('baseButton__primary')
      })
    })

    describe('非活性ボタン', () => {
      beforeEach(() => {
        result = render(
          <BaseButton onClick={() => handleClick()} isDisabled>
            test
          </BaseButton>
        )
      })

      test('disabled 属性が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('disabled')).toEqual('')
      })

      test('非活性スタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('baseButton__disabled')
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <BaseButton className="custom-class" onClick={() => handleClick()}>
            test
          </BaseButton>
        )
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('複数のスタイルプロパティ', () => {
      beforeEach(() => {
        result = render(
          <BaseButton onClick={() => handleClick()} size="large" variant="contained" color="primary">
            test
          </BaseButton>
        )
      })

      test('すべてのスタイルプロパティが同時に適用される', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('baseButton__large')
        expect(button?.className).toContain('baseButton__contained')
        expect(button?.className).toContain('baseButton__primary')
      })
    })

    describe('内部構造', () => {
      beforeEach(() => {
        result = render(<BaseButton onClick={() => handleClick()}>test</BaseButton>)
      })

      test('baseButton クラスが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('baseButton')
      })

      test('container クラスを持つ span 要素が存在する', () => {
        const container = result.container.querySelector('span[class*="baseButton_container"]')
        expect(container).not.toBe(null)
      })

      test('text クラスを持つ span 要素が存在する', () => {
        const text = result.container.querySelector('span[class*="baseButton_text"]')
        expect(text).not.toBe(null)
        expect(text?.textContent).toBe('test')
      })
    })

    describe('リンクボタンのスタイル', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseButton url="/internal/path" size="large" color="primary">
              test
            </BaseButton>
          </MemoryRouter>
        )
      })

      test('リンク要素にも BaseButton のスタイルが適用されている', () => {
        const link = result.container.querySelector('a')
        expect(link?.className).toContain('baseButton')
        expect(link?.className).toContain('baseButton__large')
        expect(link?.className).toContain('baseButton__primary')
      })
    })
  })

  //============================================================================
  // 3. Operation
  //============================================================================
  describe('Operation', () => {
    describe('クリックイベント', () => {
      beforeEach(() => {
        result = render(<BaseButton onClick={() => handleClick()}>test</BaseButton>)
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
            <BaseButton url="/internal/path">test</BaseButton>
          </MemoryRouter>
        )
      })

      test('Link コンポーネントが使用されている', () => {
        const link = result.container.querySelector('a')
        expect(link).not.toBe(null)
        expect(link?.getAttribute('href')).toEqual('/internal/path')
      })
    })

    describe('外部リンクボタン', () => {
      beforeEach(() => {
        result = render(<BaseButton url="https://example.com">test</BaseButton>)
      })

      test('a タグが使用されている', () => {
        const link = result.container.querySelector('a')
        expect(link).not.toBe(null)
        expect(link?.getAttribute('href')).toEqual('https://example.com')
      })
    })

    describe('別タブで開く外部リンクボタン', () => {
      beforeEach(() => {
        result = render(
          <BaseButton url="https://example.com" target="_blank" rel="noopener">
            test
          </BaseButton>
        )
      })

      test('target と rel 属性が正常に付与されている', () => {
        const link = result.container.querySelector('a')
        expect(link?.getAttribute('target')).toEqual('_blank')
        expect(link?.getAttribute('rel')).toEqual('noopener')
      })
    })

    describe('非活性ボタンのクリック', () => {
      beforeEach(() => {
        result = render(
          <BaseButton onClick={() => handleClick()} isDisabled>
            test
          </BaseButton>
        )
      })

      test('非活性状態ではクリックイベントが発火しない', () => {
        const button = result.container.querySelector('button')

        if (!button) {
          throw new Error('The target element was not found.')
        }

        fireEvent.click(button)
        expect(handleClick).not.toHaveBeenCalled()
      })
    })

    describe('url と onClick の併用', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseButton url="/path" onClick={() => handleClick()}>
              test
            </BaseButton>
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
