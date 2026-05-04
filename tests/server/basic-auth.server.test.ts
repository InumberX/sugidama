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
  it('returns null (auth passes) for matching credentials', async () => {
    const request = buildRequest(basicHeader(USER, PASS))
    expect(await verifyBasicAuth(request, USER, PASS)).toBeNull()
  })

  it('accepts case-insensitive scheme name', async () => {
    const request = buildRequest(basicHeader(USER, PASS).replace('Basic', 'basic'))
    expect(await verifyBasicAuth(request, USER, PASS)).toBeNull()
  })

  it('verifies UTF-8 credentials correctly', async () => {
    const u = '管理者'
    const p = 'パスワード'
    const request = buildRequest(basicHeader(u, p))
    expect(await verifyBasicAuth(request, u, p)).toBeNull()
  })

  it('returns 401 when Authorization header is missing', async () => {
    const request = buildRequest()
    const response = await verifyBasicAuth(request, USER, PASS)
    expect(response).not.toBeNull()
    expect(response?.status).toBe(401)
    expect(response?.headers.get('WWW-Authenticate')).toContain('Basic')
  })

  it('returns 401 for non-Basic scheme', async () => {
    const request = buildRequest('Bearer some-token')
    const response = await verifyBasicAuth(request, USER, PASS)
    expect(response?.status).toBe(401)
  })

  it('returns 401 for malformed credential payload (no colon)', async () => {
    const request = buildRequest(`Basic ${btoa('no-colon')}`)
    const response = await verifyBasicAuth(request, USER, PASS)
    expect(response?.status).toBe(401)
  })

  it('returns 401 for invalid base64 payload', async () => {
    const request = buildRequest('Basic !!!')
    const response = await verifyBasicAuth(request, USER, PASS)
    expect(response?.status).toBe(401)
  })

  it('returns 401 for wrong username', async () => {
    const request = buildRequest(basicHeader('wrong', PASS))
    expect((await verifyBasicAuth(request, USER, PASS))?.status).toBe(401)
  })

  it('returns 401 for wrong password', async () => {
    const request = buildRequest(basicHeader(USER, 'wrong'))
    expect((await verifyBasicAuth(request, USER, PASS))?.status).toBe(401)
  })

  it('accepts passwords that contain colons (split is at first colon only)', async () => {
    const request = buildRequest(basicHeader('admin', 'pa:ss:word'))
    expect(await verifyBasicAuth(request, 'admin', 'pa:ss:word')).toBeNull()
  })
})
