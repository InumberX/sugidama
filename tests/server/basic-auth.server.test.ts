import { describe, it, expect } from 'vitest'

import { decodeBasicCredentials, verifyBasicAuth } from '~/server/basic-auth.server'

const USER = 'admin'
const PASS = 'secret'

function buildRequest(authHeader?: string): Request {
  const headers = new Headers()
  if (authHeader !== undefined) {
    headers.set('Authorization', authHeader)
  }
  return new Request('https://example.com/', { headers })
}

function basicHeader(user: string, pass: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(`${user}:${pass}`)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return `Basic ${btoa(binary)}`
}

describe('decodeBasicCredentials', () => {
  it('decodes ASCII credentials', () => {
    const encoded = btoa('admin:secret')
    expect(decodeBasicCredentials(encoded)).toBe('admin:secret')
  })

  it('decodes UTF-8 credentials', () => {
    const encoder = new TextEncoder()
    const bytes = encoder.encode('管理者:パスワード')
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    const encoded = btoa(binary)
    expect(decodeBasicCredentials(encoded)).toBe('管理者:パスワード')
  })

  it('returns null for invalid base64', () => {
    expect(decodeBasicCredentials('!!!not-base64!!!')).toBeNull()
  })

  it('returns null for invalid UTF-8 byte sequence', () => {
    // Lone continuation byte 0x80 is invalid UTF-8.
    const encoded = btoa('\x80')
    expect(decodeBasicCredentials(encoded)).toBeNull()
  })
})

describe('verifyBasicAuth', () => {
  it('returns null (auth passes) for matching credentials', () => {
    const request = buildRequest(basicHeader(USER, PASS))
    expect(verifyBasicAuth(request, USER, PASS)).toBeNull()
  })

  it('accepts case-insensitive scheme name', () => {
    const request = buildRequest(basicHeader(USER, PASS).replace('Basic', 'basic'))
    expect(verifyBasicAuth(request, USER, PASS)).toBeNull()
  })

  it('verifies UTF-8 credentials correctly', () => {
    const u = '管理者'
    const p = 'パスワード'
    const request = buildRequest(basicHeader(u, p))
    expect(verifyBasicAuth(request, u, p)).toBeNull()
  })

  it('returns 401 when Authorization header is missing', () => {
    const request = buildRequest()
    const response = verifyBasicAuth(request, USER, PASS)
    expect(response).not.toBeNull()
    expect(response?.status).toBe(401)
    expect(response?.headers.get('WWW-Authenticate')).toContain('Basic')
  })

  it('returns 401 for non-Basic scheme', () => {
    const request = buildRequest('Bearer some-token')
    const response = verifyBasicAuth(request, USER, PASS)
    expect(response?.status).toBe(401)
  })

  it('returns 401 for malformed credential payload (no colon)', () => {
    const request = buildRequest(`Basic ${btoa('no-colon')}`)
    const response = verifyBasicAuth(request, USER, PASS)
    expect(response?.status).toBe(401)
  })

  it('returns 401 for invalid base64 payload', () => {
    const request = buildRequest('Basic !!!')
    const response = verifyBasicAuth(request, USER, PASS)
    expect(response?.status).toBe(401)
  })

  it('returns 401 for wrong username', () => {
    const request = buildRequest(basicHeader('wrong', PASS))
    expect(verifyBasicAuth(request, USER, PASS)?.status).toBe(401)
  })

  it('returns 401 for wrong password', () => {
    const request = buildRequest(basicHeader(USER, 'wrong'))
    expect(verifyBasicAuth(request, USER, PASS)?.status).toBe(401)
  })

  it('returns 401 when password contains a colon and username is wrong', () => {
    // Passwords are allowed to contain colons; username:pass split is at first colon.
    const request = buildRequest(basicHeader('admin', 'pa:ss:word'))
    expect(verifyBasicAuth(request, 'admin', 'pa:ss:word')).toBeNull()
  })
})
