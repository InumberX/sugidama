import { describe, test, expect } from 'vitest'

import { preprocessSearchKeyword } from '~/utils/search'

describe('preprocessSearchKeyword', () => {
  test('undefined の場合、空文字を返す', () => {
    expect(preprocessSearchKeyword(undefined)).toBe('')
  })

  test('空文字の場合、空文字を返す', () => {
    expect(preprocessSearchKeyword('')).toBe('')
  })

  test('前後の半角スペースがトリムされる', () => {
    expect(preprocessSearchKeyword('  keyword  ')).toBe('keyword')
  })

  test('全角スペースが半角スペースに変換される', () => {
    expect(preprocessSearchKeyword('キーワード\u3000検索')).toBe('キーワード 検索')
  })

  test('複数の全角スペースが半角スペースに変換される', () => {
    expect(preprocessSearchKeyword('a\u3000b\u3000c')).toBe('a b c')
  })

  test('トリムと全角スペース変換が同時に適用される', () => {
    expect(preprocessSearchKeyword('  キーワード\u3000検索  ')).toBe('キーワード 検索')
  })
})
