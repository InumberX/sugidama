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

  it('does not short-circuit on length mismatch (always iterates max length)', () => {
    // Snapshot the function string: the implementation must not contain
    // `return false` before the comparison loop. This protects against a
    // regression that would re-introduce a length-side-channel.
    const source = timingSafeEqual.toString()
    const beforeLoop = source.slice(0, source.indexOf('for ('))
    expect(beforeLoop).not.toMatch(/return false/)
  })
})
