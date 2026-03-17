import { render, type RenderResult, cleanup } from '@testing-library/react'
import { describe, beforeEach, afterEach, test, expect } from 'vitest'

import { ArticleCardListSkeleton } from '~/components/ui/skeletons/ArticleCardListSkeleton'

describe('ArticleCardListSkeleton', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('デフォルト表示', () => {
      beforeEach(() => {
        result = render(<ArticleCardListSkeleton listLength={12} />)
      })

      test('コンテナが正常に出力されている', () => {
        const container = result.container.querySelector('div')
        expect(container).not.toBe(null)
        expect(container?.className).toContain('articleCardListSkeleton')
      })

      test('12個のスケルトンカードが表示されている', () => {
        const itemsContainer = result.container.querySelector('[class*="articleCardListSkeleton_items"]')
        const items = itemsContainer?.children
        expect(items).toHaveLength(12)
      })

      test('各カードにPrimitiveSkeletonコンポーネントが含まれている', () => {
        const itemsContainer = result.container.querySelector('[class*="articleCardListSkeleton_items"]')
        const firstCard = itemsContainer?.children[0]
        const skeletons = firstCard?.querySelectorAll('span[class*="primitiveSkeleton"]')
        expect(skeletons?.length).toBeGreaterThan(0)
      })
    })

    describe('listLength指定', () => {
      test('指定した数のスケルトンカードが表示されている', () => {
        result = render(<ArticleCardListSkeleton listLength={5} />)
        const itemsContainer = result.container.querySelector('[class*="articleCardListSkeleton_items"]')
        const items = itemsContainer?.children
        expect(items).toHaveLength(5)
      })

      test('listLength=0の場合、カードが表示されない', () => {
        result = render(<ArticleCardListSkeleton listLength={0} />)
        const itemsContainer = result.container.querySelector('[class*="articleCardListSkeleton_items"]')
        const items = itemsContainer?.children
        expect(items).toHaveLength(0)
      })

      test('listLength=20の場合、20個のカードが表示される', () => {
        result = render(<ArticleCardListSkeleton listLength={20} />)
        const itemsContainer = result.container.querySelector('[class*="articleCardListSkeleton_items"]')
        const items = itemsContainer?.children
        expect(items).toHaveLength(20)
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(<ArticleCardListSkeleton listLength={12} className="custom-skeleton-list" />)
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const container = result.container.querySelector('div')
        expect(container?.classList.contains('custom-skeleton-list')).toBe(true)
      })

      test('デフォルトクラスも併存している', () => {
        const container = result.container.querySelector('div')
        expect(container?.className).toContain('articleCardListSkeleton')
        expect(container?.className).toContain('custom-skeleton-list')
      })
    })

    describe('スケルトンカードの構造', () => {
      beforeEach(() => {
        result = render(<ArticleCardListSkeleton listLength={1} />)
      })

      test('タイトルセクションが存在する', () => {
        const titleSection = result.container.querySelector('[class*="articleCardListSkeletonCardTitle"]')
        expect(titleSection).not.toBe(null)
        const skeleton = titleSection?.querySelector('span[class*="primitiveSkeleton"]')
        expect(skeleton).not.toBe(null)
      })

      test('説明セクションが存在する', () => {
        const descriptionSection = result.container.querySelector('[class*="articleCardListSkeletonCardDescription"]')
        expect(descriptionSection).not.toBe(null)
        const skeleton = descriptionSection?.querySelector('span[class*="primitiveSkeleton"]')
        expect(skeleton).not.toBe(null)
      })

      test('サムネイルセクションが存在する', () => {
        const thumbnailSection = result.container.querySelector('[class*="articleCardListSkeletonCardThumbnail"]')
        expect(thumbnailSection).not.toBe(null)
        const skeleton = thumbnailSection?.querySelector('span[class*="primitiveSkeleton"]')
        expect(skeleton).not.toBe(null)
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
