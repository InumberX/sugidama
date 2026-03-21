import { render, type RenderResult, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { TextButton } from '~/components/ui/buttons/TextButton'

describe('TextButton', () => {
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
        result = render(<TextButton onClick={() => handleClick()}>test</TextButton>)
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
          <TextButton buttonType="submit" onClick={() => handleClick()}>
            test
          </TextButton>
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
          <TextButton
            onClick={() => handleClick()}
            leftElm={<span data-testid="left">Left</span>}
            rightElm={<span data-testid="right">Right</span>}
          >
            Center
          </TextButton>
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
          <TextButton onClick={() => handleClick()} leftElm={<span data-testid="left">Icon</span>}>
            Button
          </TextButton>
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
          <TextButton onClick={() => handleClick()} rightElm={<span data-testid="right">Arrow</span>}>
            Button
          </TextButton>
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
          <TextButton onClick={() => handleClick()} ariaLabel="保存ボタン" role="button">
            保存
          </TextButton>
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
        result = render(<TextButton onClick={() => handleClick()} />)
      })

      test('text 要素は空で出力される', () => {
        const text = result.container.querySelector('span[class*="textButton_text"]')
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
        result = render(<TextButton onClick={() => handleClick()}>test</TextButton>)
      })

      test('medium サイズスタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('textButton__medium')
      })
    })

    describe('large サイズ', () => {
      beforeEach(() => {
        result = render(
          <TextButton onClick={() => handleClick()} size="large">
            test
          </TextButton>
        )
      })

      test('large サイズスタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('textButton__large')
      })
    })

    describe('small サイズ', () => {
      beforeEach(() => {
        result = render(
          <TextButton onClick={() => handleClick()} size="small">
            test
          </TextButton>
        )
      })

      test('small サイズスタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('textButton__small')
      })
    })

    describe('デフォルトカラー（primary）', () => {
      beforeEach(() => {
        result = render(<TextButton onClick={() => handleClick()}>test</TextButton>)
      })

      test('primary カラースタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('textButton__primary')
      })
    })

    describe('sub カラー', () => {
      beforeEach(() => {
        result = render(
          <TextButton onClick={() => handleClick()} color="sub">
            test
          </TextButton>
        )
      })

      test('sub カラースタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('textButton__sub')
      })
    })

    describe('light カラー', () => {
      beforeEach(() => {
        result = render(
          <TextButton onClick={() => handleClick()} color="light">
            test
          </TextButton>
        )
      })

      test('light カラースタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('textButton__light')
      })
    })

    describe('subDark カラー', () => {
      beforeEach(() => {
        result = render(
          <TextButton onClick={() => handleClick()} color="subDark">
            test
          </TextButton>
        )
      })

      test('subDark カラースタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('textButton__subDark')
      })
    })

    describe('非活性ボタン', () => {
      beforeEach(() => {
        result = render(
          <TextButton onClick={() => handleClick()} isDisabled>
            test
          </TextButton>
        )
      })

      test('disabled 属性が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('disabled')).toEqual('')
      })

      test('非活性スタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('textButton__disabled')
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <TextButton className="custom-class" onClick={() => handleClick()}>
            test
          </TextButton>
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
          <TextButton onClick={() => handleClick()} size="large" color="sub">
            test
          </TextButton>
        )
      })

      test('すべてのスタイルプロパティが同時に適用される', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('textButton__large')
        expect(button?.className).toContain('textButton__sub')
      })
    })

    describe('内部構造', () => {
      beforeEach(() => {
        result = render(<TextButton onClick={() => handleClick()}>test</TextButton>)
      })

      test('textButton クラスが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('textButton')
      })

      test('container クラスを持つ span 要素が存在する', () => {
        const container = result.container.querySelector('span[class*="textButton_container"]')
        expect(container).not.toBe(null)
      })

      test('text クラスを持つ span 要素が存在する', () => {
        const text = result.container.querySelector('span[class*="textButton_text"]')
        expect(text).not.toBe(null)
        expect(text?.textContent).toBe('test')
      })
    })

    describe('リンクボタンのスタイル', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <TextButton url="/internal/path" size="large" color="primary">
              test
            </TextButton>
          </MemoryRouter>
        )
      })

      test('リンク要素にも TextButton のスタイルが適用されている', () => {
        const link = result.container.querySelector('a')
        expect(link?.className).toContain('textButton')
        expect(link?.className).toContain('textButton__large')
        expect(link?.className).toContain('textButton__primary')
      })
    })
  })

  //============================================================================
  // 3. Operation
  //============================================================================
  describe('Operation', () => {
    describe('クリックイベント', () => {
      beforeEach(() => {
        result = render(<TextButton onClick={() => handleClick()}>test</TextButton>)
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
            <TextButton url="/internal/path">test</TextButton>
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
        result = render(<TextButton url="https://example.com">test</TextButton>)
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
          <TextButton url="https://example.com" target="_blank" rel="noopener">
            test
          </TextButton>
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
          <TextButton onClick={() => handleClick()} isDisabled>
            test
          </TextButton>
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
            <TextButton url="/path" onClick={() => handleClick()}>
              test
            </TextButton>
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
