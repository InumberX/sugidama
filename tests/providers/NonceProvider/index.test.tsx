import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { NonceProvider, useNonce } from '~/providers/NonceProvider'

describe('NonceProvider', () => {
  it('provides the nonce value to children via useNonce', () => {
    const { result } = renderHook(() => useNonce(), {
      wrapper: ({ children }) => <NonceProvider nonce="test-nonce-abc">{children}</NonceProvider>,
    })
    expect(result.current).toBe('test-nonce-abc')
  })

  it('returns empty string when used outside of NonceProvider', () => {
    const { result } = renderHook(() => useNonce())
    expect(result.current).toBe('')
  })

  it('provides different nonce values per provider', () => {
    const { result: result1 } = renderHook(() => useNonce(), {
      wrapper: ({ children }) => <NonceProvider nonce="nonce-1">{children}</NonceProvider>,
    })
    const { result: result2 } = renderHook(() => useNonce(), {
      wrapper: ({ children }) => <NonceProvider nonce="nonce-2">{children}</NonceProvider>,
    })
    expect(result1.current).toBe('nonce-1')
    expect(result2.current).toBe('nonce-2')
  })
})
