import { describe, afterEach, beforeEach, test, expect } from 'vitest'
import type { RenderResult } from '@testing-library/react'
import { render, cleanup } from '@testing-library/react'
import { SvgIcon } from '~/components/ui/icons/SvgIcon'

describe('SvgIcon', () => {
  let result: RenderResult

  // テスト終了後の処理
  afterEach(() => {
    cleanup()
  })

  describe('標準', () => {
    // テスト開始前の処理
    beforeEach(() => {
      result = render(<SvgIcon variant="home" />)
    })

    test('アイコンが正常に出力されている', () => {
      const icon = result.container.querySelector('i')
      expect(icon?.className).toContain('home')
    })
  })
})
