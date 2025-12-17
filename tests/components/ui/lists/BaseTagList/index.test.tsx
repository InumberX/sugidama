import { render, type RenderResult, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { BaseTagList } from '~/components/ui/lists/BaseTagList'
import type { BaseTagProps } from '~/components/ui/tags/BaseTag'

describe('BaseTagList', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('基本的なリスト表示', () => {
      const items: BaseTagProps[] = [{ children: 'Tag 1' }, { children: 'Tag 2' }, { children: 'Tag 3' }]

      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseTagList items={items} />
          </MemoryRouter>
        )
      })

      test('指定した数のタグが表示される', () => {
        const listItems = result.container.querySelectorAll('li')
        expect(listItems.length).toBe(3)
      })

      test('各タグのテキストが正しく表示される', () => {
        expect(result.getByText('Tag 1')).not.toBe(null)
        expect(result.getByText('Tag 2')).not.toBe(null)
        expect(result.getByText('Tag 3')).not.toBe(null)
      })
    })

    describe('空のリスト', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseTagList items={[]} />
          </MemoryRouter>
        )
      })

      test('リスト要素は存在するがアイテムは表示されない', () => {
        const ul = result.container.querySelector('ul')
        const listItems = result.container.querySelectorAll('li')

        expect(ul).not.toBe(null)
        expect(listItems.length).toBe(0)
      })
    })

    describe('タグのプロパティ伝播', () => {
      const items: BaseTagProps[] = [
        { children: 'Link Tag', url: 'https://example.com' },
        { children: 'Button Tag', onClick: vi.fn() },
        { children: 'Outlined Tag', variant: 'outlined' },
      ]

      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseTagList items={items} />
          </MemoryRouter>
        )
      })

      test('url を持つタグはリンクとしてレンダリングされる', () => {
        const link = result.container.querySelector('a[href="https://example.com"]')
        expect(link).not.toBe(null)
        expect(link?.textContent).toContain('Link Tag')
      })

      test('onClick を持つタグはボタンとしてレンダリングされる', () => {
        const buttons = result.container.querySelectorAll('button')
        const buttonTexts = Array.from(buttons).map((b) => b.textContent)
        expect(buttonTexts.some((text) => text?.includes('Button Tag'))).toBe(true)
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('セマンティックマークアップ（デフォルト）', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseTagList items={[{ children: 'Tag' }]} />
          </MemoryRouter>
        )
      })

      test('div 要素でラップされる', () => {
        const wrapper = result.container.firstElementChild
        expect(wrapper?.tagName).toBe('DIV')
      })

      test('ul 要素が使用される', () => {
        const ul = result.container.querySelector('ul')
        expect(ul).not.toBe(null)
      })

      test('li 要素でアイテムがラップされる', () => {
        const li = result.container.querySelector('li')
        expect(li).not.toBe(null)
      })
    })

    describe('非セマンティックマークアップ', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseTagList items={[{ children: 'Tag' }]} isNotSemantic />
          </MemoryRouter>
        )
      })

      test('span 要素でラップされる', () => {
        const wrapper = result.container.firstElementChild
        expect(wrapper?.tagName).toBe('SPAN')
      })

      test('ul 要素は使用されない', () => {
        const ul = result.container.querySelector('ul')
        expect(ul).toBe(null)
      })

      test('li 要素は使用されない', () => {
        const li = result.container.querySelector('li')
        expect(li).toBe(null)
      })

      test('全て span 要素で構成される', () => {
        const spans = result.container.querySelectorAll('span')
        expect(spans.length).toBeGreaterThan(0)
      })
    })

    describe('className の適用', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseTagList items={[{ children: 'Tag' }]} className="custom-class" />
          </MemoryRouter>
        )
      })

      test('カスタムクラス名がラッパーに適用される', () => {
        const wrapper = result.container.firstElementChild
        expect(wrapper?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('align プロパティ', () => {
      describe('left（デフォルト）', () => {
        beforeEach(() => {
          result = render(
            <MemoryRouter>
              <BaseTagList items={[{ children: 'Tag' }]} />
            </MemoryRouter>
          )
        })

        test('left 用のクラスが適用される', () => {
          const items = result.container.querySelector('ul')
          expect(items?.className).toContain('left')
        })
      })

      describe('center', () => {
        beforeEach(() => {
          result = render(
            <MemoryRouter>
              <BaseTagList items={[{ children: 'Tag' }]} align="center" />
            </MemoryRouter>
          )
        })

        test('center 用のクラスが適用される', () => {
          const items = result.container.querySelector('ul')
          expect(items?.className).toContain('center')
        })
      })

      describe('right', () => {
        beforeEach(() => {
          result = render(
            <MemoryRouter>
              <BaseTagList items={[{ children: 'Tag' }]} align="right" />
            </MemoryRouter>
          )
        })

        test('right 用のクラスが適用される', () => {
          const items = result.container.querySelector('ul')
          expect(items?.className).toContain('right')
        })
      })
    })
  })

  //============================================================================
  // 3. Operation
  //============================================================================
  describe('Operation', () => {
    describe('タグのクリックイベント', () => {
      const handleClick = vi.fn()
      const items: BaseTagProps[] = [{ children: 'Clickable Tag', onClick: handleClick }]

      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseTagList items={items} />
          </MemoryRouter>
        )
      })

      test('タグをクリックするとイベントハンドラが呼ばれる', () => {
        const button = result.container.querySelector('button')
        button?.click()
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })
  })

  //============================================================================
  // 4. Validation (for forms)
  //============================================================================
  // このコンポーネントはフォーム要素ではないため、バリデーションテストは不要

  //============================================================================
  // 5. Others (Optional)
  //============================================================================
  describe('Others', () => {
    describe('複数アイテムの順序', () => {
      const items: BaseTagProps[] = [{ children: 'First' }, { children: 'Second' }, { children: 'Third' }]

      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseTagList items={items} />
          </MemoryRouter>
        )
      })

      test('アイテムが配列の順序通りに表示される', () => {
        const listItems = result.container.querySelectorAll('li')
        expect(listItems[0]?.textContent).toContain('First')
        expect(listItems[1]?.textContent).toContain('Second')
        expect(listItems[2]?.textContent).toContain('Third')
      })
    })

    describe('異なるバリアントの混在', () => {
      const items: BaseTagProps[] = [
        { children: 'Contained', variant: 'contained' },
        { children: 'Outlined', variant: 'outlined' },
      ]

      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <BaseTagList items={items} />
          </MemoryRouter>
        )
      })

      test('異なるバリアントのタグが共存できる', () => {
        expect(result.getByText('Contained')).not.toBe(null)
        expect(result.getByText('Outlined')).not.toBe(null)
      })
    })
  })
})
