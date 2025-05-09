import { describe, vi, afterEach, beforeEach, test, expect } from 'vitest'
import type { RenderResult } from '@testing-library/react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import { BaseButton } from '~/components/ui/buttons/BaseButton'

describe('BaseButton', () => {
  let result: RenderResult
  const handleClick: () => void = vi.fn()

  // テスト終了後の処理
  afterEach(() => {
    cleanup()
    vi.resetAllMocks()
  })

  describe('標準ボタン', () => {
    // テスト開始前の処理
    beforeEach(() => {
      result = render(
        <BaseButton onClick={() => handleClick()}>
          <span className="TestText">test</span>
        </BaseButton>
      )
    })

    test('テキストが正常に出力されている', () => {
      const button = result.container.querySelector('button')
      const text = button?.querySelector('.TestText')
      expect(text).not.toBe(null)
      expect(text?.innerHTML).toBe('test')
    })

    test('typeが正常に付与されている', () => {
      const button = result.container.querySelector('button')
      expect(button?.getAttribute('type')).toEqual('button')
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

  describe('非活性ボタン', () => {
    // テスト開始前の処理
    beforeEach(() => {
      result = render(
        <BaseButton onClick={() => handleClick()} isDisabled>
          <span className="TestText">test</span>
        </BaseButton>
      )
    })

    test('属性が正常に付与されている', () => {
      const button = result.container.querySelector('button')
      expect(button?.getAttribute('disabled')).toEqual('')
    })
  })

  describe('リンクボタン', () => {
    // テスト開始前の処理
    beforeEach(() => {
      result = render(
        <BaseButton url="https://test.com/">
          <span className="TestText">test</span>
        </BaseButton>
      )
    })

    test('遷移先が正常に設定されている', () => {
      const button = result.container.querySelector('a')
      expect(button?.getAttribute('href')).toEqual('https://test.com/')
    })
  })

  describe('別タブで開くリンクボタン', () => {
    // テスト開始前の処理
    beforeEach(() => {
      result = render(
        <BaseButton url="https://test.com/" target="_blank" rel="noopener">
          <span className="TestText">test</span>
        </BaseButton>
      )
    })

    test('属性が正常に付与されている', () => {
      const button = result.container.querySelector('a')
      expect(button?.getAttribute('target')).toEqual('_blank')
      expect(button?.getAttribute('rel')).toEqual('noopener')
    })
  })

  describe('左要素', () => {
    // テスト開始前の処理
    beforeEach(() => {
      result = render(
        <BaseButton onClick={() => handleClick()} leftElm={<span className="TestLeft">testLeft</span>}>
          <span className="TestText">test</span>
        </BaseButton>
      )
    })

    test('要素が正常に出力されている', () => {
      const button = result.container.querySelector('button')
      expect(button?.querySelector('.TestLeft')).not.toBe(null)
    })
  })

  describe('右要素', () => {
    // テスト開始前の処理
    beforeEach(() => {
      result = render(
        <BaseButton onClick={() => handleClick()} rightElm={<span className="TestRight">testRight</span>}>
          <span className="TestText">test</span>
        </BaseButton>
      )
    })

    test('要素が正常に出力されている', () => {
      const button = result.container.querySelector('button')
      expect(button?.querySelector('.TestRight')).not.toBe(null)
    })
  })
})
