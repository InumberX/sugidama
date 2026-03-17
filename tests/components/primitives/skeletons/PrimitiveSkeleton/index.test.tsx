import { render, type RenderResult, cleanup } from '@testing-library/react'
import { describe, beforeEach, afterEach, test, expect } from 'vitest'

import { PrimitiveSkeleton } from '~/components/primitives/skeletons/PrimitiveSkeleton'

describe('PrimitiveSkeleton', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('デフォルトスケルトン', () => {
      beforeEach(() => {
        result = render(<PrimitiveSkeleton />)
      })

      test('span要素が正常に出力されている', () => {
        const skeleton = result.container.querySelector('span')
        expect(skeleton).not.toBe(null)
      })

      test('デフォルトクラスが適用されている', () => {
        const skeleton = result.container.querySelector('span')
        expect(skeleton?.className).toContain('primitiveSkeleton')
        expect(skeleton?.className).toContain('primitiveSkeleton__auto')
        expect(skeleton?.className).toContain('primitiveSkeleton__sub')
      })
    })

    describe('バリアント指定', () => {
      test('rectangle バリアントが正常に適用されている', () => {
        result = render(<PrimitiveSkeleton variant="rectangle" />)
        const skeleton = result.container.querySelector('span')
        expect(skeleton?.className).toContain('primitiveSkeleton__rectangle')
      })

      test('square バリアントが正常に適用されている', () => {
        result = render(<PrimitiveSkeleton variant="square" />)
        const skeleton = result.container.querySelector('span')
        expect(skeleton?.className).toContain('primitiveSkeleton__square')
      })

      test('circle バリアントが正常に適用されている', () => {
        result = render(<PrimitiveSkeleton variant="circle" />)
        const skeleton = result.container.querySelector('span')
        expect(skeleton?.className).toContain('primitiveSkeleton__circle')
      })

      test('bar バリアントが正常に適用されている', () => {
        result = render(<PrimitiveSkeleton variant="bar" />)
        const skeleton = result.container.querySelector('span')
        expect(skeleton?.className).toContain('primitiveSkeleton__bar')
      })
    })

    describe('カラー指定', () => {
      test('sub カラーが正常に適用されている', () => {
        result = render(<PrimitiveSkeleton color="sub" />)
        const skeleton = result.container.querySelector('span')
        expect(skeleton?.className).toContain('primitiveSkeleton__sub')
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(<PrimitiveSkeleton className="custom-skeleton-class" />)
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const skeleton = result.container.querySelector('span')
        expect(skeleton?.classList.contains('custom-skeleton-class')).toBe(true)
      })

      test('デフォルトクラスも併存している', () => {
        const skeleton = result.container.querySelector('span')
        expect(skeleton?.className).toContain('primitiveSkeleton')
        expect(skeleton?.className).toContain('custom-skeleton-class')
      })
    })

    describe('複数プロパティの組み合わせ', () => {
      beforeEach(() => {
        result = render(<PrimitiveSkeleton variant="rectangle" color="sub" className="button-skeleton" />)
      })

      test('すべてのプロパティが正常に適用されている', () => {
        const skeleton = result.container.querySelector('span')
        expect(skeleton?.className).toContain('primitiveSkeleton')
        expect(skeleton?.className).toContain('primitiveSkeleton__rectangle')
        expect(skeleton?.className).toContain('primitiveSkeleton__sub')
        expect(skeleton?.className).toContain('button-skeleton')
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
