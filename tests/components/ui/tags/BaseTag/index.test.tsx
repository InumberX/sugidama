import { render, type RenderResult, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { BaseTag } from '~/components/ui/tags/BaseTag'

describe('BaseTag', () => {
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
    describe('基本的なタグ', () => {
      beforeEach(() => {
        result = render(<BaseTag>test</BaseTag>)
      })

      test('children が正常に出力されている', () => {
        const span = result.container.querySelector('span')
        expect(span).not.toBe(null)
        expect(span?.textContent).toBe('test')
      })
    })

    describe('leftElm と rightElm', () => {
      beforeEach(() => {
        result = render(
          <BaseTag leftElm={<span data-testid="left">Left</span>} rightElm={<span data-testid="right">Right</span>}>
            Center
          </BaseTag>
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
        const text = result.container.querySelector('span[class*="baseTag_text"]')
        expect(text?.textContent).toBe('Center')
      })
    })

    describe('leftElm のみ', () => {
      beforeEach(() => {
        result = render(<BaseTag leftElm={<span data-testid="left">Icon</span>}>Tag</BaseTag>)
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
        result = render(<BaseTag rightElm={<span data-testid="right">X</span>}>Tag</BaseTag>)
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

    describe('children なしの場合', () => {
      beforeEach(() => {
        result = render(<BaseTag />)
      })

      test('text 要素は空で出力される', () => {
        const text = result.container.querySelector('span[class*="baseTag_text"]')
        expect(text).not.toBe(null)
        expect(text?.textContent).toBe('')
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('ベーススタイル', () => {
      beforeEach(() => {
        result = render(<BaseTag>test</BaseTag>)
      })

      test('baseTag クラスが適用されている', () => {
        const tag = result.container.querySelector('span[class*="baseTag"]')
        expect(tag?.className).toContain('baseTag')
      })
    })

    describe('デフォルトバリアント（contained）', () => {
      beforeEach(() => {
        result = render(<BaseTag>test</BaseTag>)
      })

      test('contained バリアントスタイルが適用されている', () => {
        const tag = result.container.querySelector('span[class*="baseTag"]')
        expect(tag?.className).toContain('baseTag__contained')
      })
    })

    describe('outlined バリアント', () => {
      beforeEach(() => {
        result = render(<BaseTag variant="outlined">test</BaseTag>)
      })

      test('outlined バリアントスタイルが適用されている', () => {
        const tag = result.container.querySelector('span[class*="baseTag"]')
        expect(tag?.className).toContain('baseTag__outlined')
      })
    })

    describe('デフォルトカラー（sub）', () => {
      beforeEach(() => {
        result = render(<BaseTag>test</BaseTag>)
      })

      test('sub カラースタイルが適用されている', () => {
        const tag = result.container.querySelector('span[class*="baseTag"]')
        expect(tag?.className).toContain('baseTag__sub')
      })
    })

    describe('onClick がある場合', () => {
      beforeEach(() => {
        result = render(<BaseTag onClick={() => handleClick()}>test</BaseTag>)
      })

      test('baseTag__button スタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('baseTag__button')
      })
    })

    describe('url がある場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseTag url="/path">test</BaseTag>
          </MemoryRouter>
        )
      })

      test('baseTag__button スタイルが適用されている', () => {
        const link = result.container.querySelector('a')
        expect(link?.className).toContain('baseTag__button')
      })
    })

    describe('onClick も url もない場合', () => {
      beforeEach(() => {
        result = render(<BaseTag>test</BaseTag>)
      })

      test('baseTag__button スタイルは適用されない', () => {
        const tag = result.container.querySelector('span[class*="baseTag"]')
        expect(tag?.className).not.toContain('baseTag__button')
      })
    })

    describe('非活性タグ', () => {
      beforeEach(() => {
        result = render(
          <BaseTag onClick={() => handleClick()} isDisabled>
            test
          </BaseTag>
        )
      })

      test('disabled 属性が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('disabled')).toEqual('')
      })

      test('非活性スタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('baseTag__disabled')
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(<BaseTag className="custom-class">test</BaseTag>)
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const tag = result.container.querySelector('span[class*="baseTag"]')
        expect(tag?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('複数のスタイルプロパティ', () => {
      beforeEach(() => {
        result = render(
          <BaseTag variant="outlined" color="sub" onClick={() => handleClick()}>
            test
          </BaseTag>
        )
      })

      test('すべてのスタイルプロパティが同時に適用される', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('baseTag__outlined')
        expect(button?.className).toContain('baseTag__sub')
        expect(button?.className).toContain('baseTag__button')
      })
    })

    describe('内部構造', () => {
      beforeEach(() => {
        result = render(<BaseTag>test</BaseTag>)
      })

      test('container クラスを持つ span 要素が存在する', () => {
        const container = result.container.querySelector('span[class*="baseTag_container"]')
        expect(container).not.toBe(null)
      })

      test('text クラスを持つ span 要素が存在する', () => {
        const text = result.container.querySelector('span[class*="baseTag_text"]')
        expect(text).not.toBe(null)
        expect(text?.textContent).toBe('test')
      })
    })

    describe('リンクタグのスタイル', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseTag url="/path" variant="outlined">
              test
            </BaseTag>
          </MemoryRouter>
        )
      })

      test('リンク要素にも BaseTag のスタイルが適用されている', () => {
        const link = result.container.querySelector('a')
        expect(link?.className).toContain('baseTag')
        expect(link?.className).toContain('baseTag__outlined')
        expect(link?.className).toContain('baseTag__button')
      })
    })
  })

  //============================================================================
  // 3. Operation
  //============================================================================
  describe('Operation', () => {
    describe('クリックイベント', () => {
      beforeEach(() => {
        result = render(<BaseTag onClick={() => handleClick()}>test</BaseTag>)
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

    describe('内部リンクタグ', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseTag url="/internal/path">test</BaseTag>
          </MemoryRouter>
        )
      })

      test('Link コンポーネントが使用されている', () => {
        const link = result.container.querySelector('a')
        expect(link).not.toBe(null)
        expect(link?.getAttribute('href')).toEqual('/internal/path')
      })
    })

    describe('外部リンクタグ', () => {
      beforeEach(() => {
        result = render(<BaseTag url="https://example.com">test</BaseTag>)
      })

      test('a タグが使用されている', () => {
        const link = result.container.querySelector('a')
        expect(link).not.toBe(null)
        expect(link?.getAttribute('href')).toEqual('https://example.com')
      })
    })

    describe('非活性タグのクリック', () => {
      beforeEach(() => {
        result = render(
          <BaseTag onClick={() => handleClick()} isDisabled>
            test
          </BaseTag>
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
            <BaseTag url="/path" onClick={() => handleClick()}>
              test
            </BaseTag>
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
