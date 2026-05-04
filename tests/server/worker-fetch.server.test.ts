import { describe, it, expect, vi } from 'vitest'

import { createWorkerFetch } from '~/server/worker-fetch.server'

const USER = 'admin'
const PASS = 'secret'

function basicHeader(user: string, pass: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(`${user}:${pass}`)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return `Basic ${btoa(binary)}`
}

function buildRequest(authHeader?: string): Request {
  const headers = new Headers()
  if (authHeader !== undefined) {
    headers.set('Authorization', authHeader)
  }
  return new Request('https://example.com/', { headers })
}

describe('createWorkerFetch', () => {
  it('forwards to handler when no auth env is configured', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }))
    const fetch = createWorkerFetch(handler)
    const response = await fetch(buildRequest(), {})
    expect(handler).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('ok')
  })

  it('forwards when only BASIC_AUTH_USER is set (auth not enforced)', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('ok'))
    const fetch = createWorkerFetch(handler)
    const response = await fetch(buildRequest(), { BASIC_AUTH_USER: USER })
    expect(handler).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
  })

  it('forwards when only BASIC_AUTH_PASS is set (auth not enforced)', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('ok'))
    const fetch = createWorkerFetch(handler)
    const response = await fetch(buildRequest(), { BASIC_AUTH_PASS: PASS })
    expect(handler).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
  })

  it('returns 401 without invoking handler when auth required and header missing', async () => {
    const handler = vi.fn()
    const fetch = createWorkerFetch(handler)
    const response = await fetch(buildRequest(), { BASIC_AUTH_USER: USER, BASIC_AUTH_PASS: PASS })
    expect(handler).not.toHaveBeenCalled()
    expect(response.status).toBe(401)
    expect(response.headers.get('WWW-Authenticate')).toContain('Basic')
  })

  it('returns 401 without invoking handler when credentials are wrong', async () => {
    const handler = vi.fn()
    const fetch = createWorkerFetch(handler)
    const response = await fetch(buildRequest(basicHeader('wrong', 'wrong')), {
      BASIC_AUTH_USER: USER,
      BASIC_AUTH_PASS: PASS,
    })
    expect(handler).not.toHaveBeenCalled()
    expect(response.status).toBe(401)
  })

  it('forwards to handler when auth required and credentials are correct', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('ok'))
    const fetch = createWorkerFetch(handler)
    const response = await fetch(buildRequest(basicHeader(USER, PASS)), {
      BASIC_AUTH_USER: USER,
      BASIC_AUTH_PASS: PASS,
    })
    expect(handler).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
  })

  it('passes through the original Request to the handler', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('ok'))
    const fetch = createWorkerFetch(handler)
    const request = buildRequest()
    await fetch(request, {})
    expect(handler).toHaveBeenCalledWith(request)
  })
})
