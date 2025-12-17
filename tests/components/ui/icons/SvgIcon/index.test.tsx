import { render, type RenderResult, cleanup } from '@testing-library/react'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { SvgIcon, type SvgIconVariant } from '~/components/ui/icons/SvgIcon'

describe('SvgIcon', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('基本的なアイコン', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant="home" />)
      })

      test('i 要素がレンダリングされる', () => {
        const icon = result.container.querySelector('i')
        expect(icon).not.toBe(null)
      })
    })

    describe('title 属性', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant="home" title="ホーム" />)
      })

      test('title が正常に付与されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.getAttribute('title')).toEqual('ホーム')
      })

      test('aria-label が正常に付与されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.getAttribute('aria-label')).toEqual('ホーム')
      })
    })

    describe('title なしの場合', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant="home" />)
      })

      test('title 属性は付与されない', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.getAttribute('title')).toBe(null)
      })

      test('aria-label 属性は付与されない', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.getAttribute('aria-label')).toBe(null)
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('ベーススタイル', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant="home" />)
      })

      test('svgIcon クラスが適用されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.className).toContain('svgIcon')
      })
    })

    describe('variant スタイル', () => {
      const variants: SvgIconVariant[] = [
        'home',
        'search',
        'mail',
        'liquor',
        'translate',
        'keyboardArrowDown',
        'keyboardArrowLeft',
        'keyboardArrowRight',
        'keyboardArrowUp',
      ]

      variants.forEach((variant) => {
        test(`${variant} バリアントスタイルが適用されている`, () => {
          result = render(<SvgIcon variant={variant} />)
          const icon = result.container.querySelector('i')
          expect(icon?.className).toContain(`svgIcon__${variant}`)
          cleanup()
        })
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant="home" className="custom-class" />)
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.classList.contains('custom-class')).toBe(true)
      })

      test('ベーススタイルも同時に適用されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.className).toContain('svgIcon')
        expect(icon?.className).toContain('svgIcon__home')
      })
    })

    describe('className なしの場合', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant="search" />)
      })

      test('ベーススタイルと variant スタイルのみ適用される', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.className).toContain('svgIcon')
        expect(icon?.className).toContain('svgIcon__search')
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
