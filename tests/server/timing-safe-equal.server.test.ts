import { describe, it, expect } from 'vitest'

import { timingSafeEqual } from '~/server/timing-safe-equal.server'

describe('timingSafeEqual', () => {
  it('returns true for identical strings', async () => {
    expect(await timingSafeEqual('abc', 'abc')).toBe(true)
    expect(await timingSafeEqual('', '')).toBe(true)
  })

  it('returns false for strings of the same length but different content', async () => {
    expect(await timingSafeEqual('abc', 'abd')).toBe(false)
  })

  it('returns false for strings of different lengths', async () => {
    expect(await timingSafeEqual('abc', 'abcd')).toBe(false)
    expect(await timingSafeEqual('abcd', 'abc')).toBe(false)
    expect(await timingSafeEqual('', 'a')).toBe(false)
  })

  it('handles UTF-8 multi-byte characters correctly', async () => {
    expect(await timingSafeEqual('日本語', '日本語')).toBe(true)
    expect(await timingSafeEqual('日本語', '日本')).toBe(false)
    expect(await timingSafeEqual('café', 'cafe')).toBe(false)
  })

  it('rejects strings whose prefix matches but the longer one extends past it', async () => {
    expect(await timingSafeEqual('abc', 'abcXY')).toBe(false)
    expect(await timingSafeEqual('abcXY', 'abc')).toBe(false)
  })

  it('rejects vastly different inputs (sanity check that hashing works)', async () => {
    const long = 'x'.repeat(10_000)
    expect(await timingSafeEqual(long, long)).toBe(true)
    expect(await timingSafeEqual(long, long.slice(0, -1))).toBe(false)
  })
})
