import { render, cleanup } from '@testing-library/react'
import type { RenderResult } from '@testing-library/react'
import { describe, afterEach, beforeEach, test, expect } from 'vitest'

import { ReplaceNewLineText } from '~/components/ui/typographies/ReplaceNewLineText'

describe('ReplaceNewLineText', () => {
  let result: RenderResult

  // テスト終了後の処理
  afterEach(() => {
    cleanup()
  })

  describe('標準', () => {
    // テスト開始前の処理
    beforeEach(() => {
      result = render(
        <p>
          <ReplaceNewLineText text={'test\ntest\n\ntest'} />
        </p>
      )
    })

    test('テキストが正常に出力されている', () => {
      const text = result.container.querySelector('p')
      expect(text?.innerHTML).toBe('test<br>test<br><br>test')
    })
  })
})
