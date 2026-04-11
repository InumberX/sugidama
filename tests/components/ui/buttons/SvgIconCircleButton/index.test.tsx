import { cleanup, fireEvent, render, type RenderResult } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { SvgIconCircleButton } from '~/components/ui/buttons/SvgIconCircleButton'

describe('SvgIconCircleButton', () => {
  let result: RenderResult
  const handleClick = vi.fn()

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
        result = render(<SvgIconCircleButton icon="search" title="検索" onClick={handleClick} />)
      })

      test('button 要素がレンダリングされる', () => {
        const button = result.container.querySelector('button')
        expect(button).not.toBe(null)
      })

      test('type="button" が付与される', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('type')).toBe('button')
      })

      test('title から aria-label が付与される', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('aria-label')).toBe('検索')
      })

      test('指定したアイコンが出力される', () => {
        const icon = result.container.querySelector('i')
        expect(icon).not.toBe(null)
        expect(icon?.className).toContain('svgIcon__search')
      })
    })

    describe('submit ボタン', () => {
      beforeEach(() => {
        result = render(<SvgIconCircleButton icon="check" title="保存" buttonType="submit" onClick={handleClick} />)
      })

      test('type="submit" が付与される', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('type')).toBe('submit')
      })
    })

    describe('内部リンク', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <SvgIconCircleButton icon="home" title="ホーム" url="/drinks" />
          </MemoryRouter>
        )
      })

      test('Link が anchor 要素としてレンダリングされる', () => {
        const link = result.container.querySelector('a')
        expect(link).not.toBe(null)
        expect(link?.getAttribute('href')).toBe('/drinks')
      })
    })

    describe('外部リンク', () => {
      beforeEach(() => {
        result = render(
          <SvgIconCircleButton icon="mail" title="外部リンク" url="https://example.com" target="_blank" />
        )
      })

      test('anchor 要素がレンダリングされる', () => {
        const link = result.container.querySelector('a')
        expect(link).not.toBe(null)
        expect(link?.getAttribute('href')).toBe('https://example.com')
        expect(link?.getAttribute('target')).toBe('_blank')
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('デフォルト値', () => {
      beforeEach(() => {
        result = render(<SvgIconCircleButton icon="keyboardArrowRight" title="次へ" onClick={handleClick} />)
      })

      test('medium サイズスタイルが適用される', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('svgIconCircleButton__medium')
      })

      test('primary カラースタイルが適用される', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('svgIconCircleButton__primary')
      })

      test('contained バリアントスタイルが適用される', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('svgIconCircleButton__contained')
      })
    })

    describe('サイズ指定', () => {
      test('small サイズスタイルが適用される', () => {
        result = render(<SvgIconCircleButton icon="keyboardArrowUp" title="上へ" size="small" onClick={handleClick} />)

        const button = result.container.querySelector('button')
        expect(button?.className).toContain('svgIconCircleButton__small')
      })

      test('large サイズスタイルが適用される', () => {
        result = render(
          <SvgIconCircleButton icon="keyboardArrowDown" title="下へ" size="large" onClick={handleClick} />
        )

        const button = result.container.querySelector('button')
        expect(button?.className).toContain('svgIconCircleButton__large')
      })
    })

    describe('無効状態', () => {
      beforeEach(() => {
        result = render(<SvgIconCircleButton icon="moreHoriz" title="メニュー" isDisabled onClick={handleClick} />)
      })

      test('disabled 属性が付与される', () => {
        const button = result.container.querySelector('button')
        expect(button?.hasAttribute('disabled')).toBe(true)
      })

      test('disabled 用のスタイルが適用される', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('svgIconCircleButton__disabled')
      })
    })
  })

  //============================================================================
  // 3. Interaction
  //============================================================================
  describe('Interaction', () => {
    describe('クリック時', () => {
      beforeEach(() => {
        result = render(<SvgIconCircleButton icon="search" title="検索" onClick={handleClick} />)
      })

      test('onClick が実行される', () => {
        const button = result.container.querySelector('button')
        expect(button).not.toBe(null)

        if (!button) {
          return
        }

        fireEvent.click(button)
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })

    describe('無効時のクリック', () => {
      beforeEach(() => {
        result = render(<SvgIconCircleButton icon="search" title="検索" isDisabled onClick={handleClick} />)
      })

      test('onClick は実行されない', () => {
        const button = result.container.querySelector('button')
        expect(button).not.toBe(null)

        if (!button) {
          return
        }

        fireEvent.click(button)
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
