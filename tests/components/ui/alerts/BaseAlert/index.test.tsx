import { render, type RenderResult, cleanup } from '@testing-library/react'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { BaseAlert } from '~/components/ui/alerts/BaseAlert'

describe('BaseAlert', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('基本的なアラート', () => {
      beforeEach(() => {
        result = render(<BaseAlert />)
      })

      test('div 要素がレンダリングされる', () => {
        const alert = result.container.querySelector('div')
        expect(alert).not.toBe(null)
      })
    })

    describe('title を指定した場合', () => {
      beforeEach(() => {
        result = render(<BaseAlert title="テストタイトル" />)
      })

      test('title が表示される', () => {
        expect(result.container.textContent).toContain('テストタイトル')
      })
    })

    describe('description を指定した場合', () => {
      beforeEach(() => {
        result = render(<BaseAlert description="テスト説明文" />)
      })

      test('description が表示される', () => {
        expect(result.container.textContent).toContain('テスト説明文')
      })
    })

    describe('title と description を両方指定した場合', () => {
      beforeEach(() => {
        result = render(<BaseAlert title="タイトル" description="説明文" />)
      })

      test('title と description が両方表示される', () => {
        expect(result.container.textContent).toContain('タイトル')
        expect(result.container.textContent).toContain('説明文')
      })
    })

    describe('title を指定しない場合', () => {
      beforeEach(() => {
        result = render(<BaseAlert description="説明文のみ" />)
      })

      test('title の p 要素はレンダリングされない', () => {
        const paragraphs = result.container.querySelectorAll('p')
        expect(paragraphs.length).toBe(1)
        expect(paragraphs[0]?.textContent).toBe('説明文のみ')
      })
    })

    describe('description を指定しない場合', () => {
      beforeEach(() => {
        result = render(<BaseAlert title="タイトルのみ" />)
      })

      test('description の p 要素はレンダリングされない', () => {
        const paragraphs = result.container.querySelectorAll('p')
        expect(paragraphs.length).toBe(1)
        expect(paragraphs[0]?.textContent).toBe('タイトルのみ')
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('デフォルトスタイル', () => {
      beforeEach(() => {
        result = render(<BaseAlert />)
      })

      test('baseAlert クラスが適用されている', () => {
        const alert = result.container.firstElementChild
        expect(alert?.className).toContain('baseAlert')
      })

      test('デフォルトの variant (contained) スタイルが適用されている', () => {
        const alert = result.container.firstElementChild
        expect(alert?.className).toContain('baseAlert__contained')
      })

      test('デフォルトの color (success) スタイルが適用されている', () => {
        const alert = result.container.firstElementChild
        expect(alert?.className).toContain('baseAlert__success')
      })
    })

    describe('color スタイル', () => {
      test('success カラースタイルが適用されている', () => {
        result = render(<BaseAlert color="success" />)
        const alert = result.container.firstElementChild
        expect(alert?.className).toContain('baseAlert__success')
      })

      test('error カラースタイルが適用されている', () => {
        result = render(<BaseAlert color="error" />)
        const alert = result.container.firstElementChild
        expect(alert?.className).toContain('baseAlert__error')
      })
    })

    describe('variant スタイル', () => {
      test('contained バリアントスタイルが適用されている', () => {
        result = render(<BaseAlert variant="contained" />)
        const alert = result.container.firstElementChild
        expect(alert?.className).toContain('baseAlert__contained')
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(<BaseAlert className="custom-class" />)
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const alert = result.container.firstElementChild
        expect(alert?.classList.contains('custom-class')).toBe(true)
      })

      test('ベーススタイルも同時に適用されている', () => {
        const alert = result.container.firstElementChild
        expect(alert?.className).toContain('baseAlert')
        expect(alert?.className).toContain('baseAlert__contained')
        expect(alert?.className).toContain('baseAlert__success')
      })
    })

    describe('className なしの場合', () => {
      beforeEach(() => {
        result = render(<BaseAlert />)
      })

      test('ベーススタイルと variant・color スタイルのみ適用される', () => {
        const alert = result.container.firstElementChild
        expect(alert?.className).toContain('baseAlert')
        expect(alert?.className).toContain('baseAlert__contained')
        expect(alert?.className).toContain('baseAlert__success')
      })
    })

    describe('アイコン', () => {
      beforeEach(() => {
        result = render(<BaseAlert />)
      })

      test('SvgIcon がレンダリングされている', () => {
        const icon = result.container.querySelector('i')
        expect(icon).not.toBe(null)
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
