import { describe, it, expect } from 'vitest'

import { timingSafeEqual } from '~/server/timing-safe-equal.server'

describe('timingSafeEqual', () => {
  it('returns true for identical strings', () => {
    expect(timingSafeEqual('abc', 'abc')).toBe(true)
    expect(timingSafeEqual('', '')).toBe(true)
  })

  it('returns false for strings of the same length but different content', () => {
    expect(timingSafeEqual('abc', 'abd')).toBe(false)
  })

  it('returns false for strings of different lengths', () => {
    expect(timingSafeEqual('abc', 'abcd')).toBe(false)
    expect(timingSafeEqual('abcd', 'abc')).toBe(false)
    expect(timingSafeEqual('', 'a')).toBe(false)
  })

  it('handles UTF-8 multi-byte characters correctly', () => {
    expect(timingSafeEqual('日本語', '日本語')).toBe(true)
    expect(timingSafeEqual('日本語', '日本')).toBe(false)
    expect(timingSafeEqual('café', 'cafe')).toBe(false)
  })

  it('rejects strings whose prefix matches but the longer one extends past it', () => {
    // Without seeding `diff` with the length difference, a same-prefix longer
    // string would compare equal to the shorter one because the loop only
    // XORs bytes that exist in the shorter string.
    expect(timingSafeEqual('abc', 'abcXY')).toBe(false)
    expect(timingSafeEqual('abcXY', 'abc')).toBe(false)
  })
})
