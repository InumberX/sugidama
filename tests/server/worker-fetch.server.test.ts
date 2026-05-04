import { describe, it, expect, vi } from 'vitest'

import { createWorkerFetch, type WorkerEnv } from '~/server/worker-fetch.server'

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

function buildRequest(options: { method?: string; authHeader?: string } = {}): Request {
  const { method = 'GET', authHeader } = options
  const headers = new Headers()
  if (authHeader !== undefined) {
    headers.set('Authorization', authHeader)
  }
  return new Request('https://example.com/', { method, headers })
}

function buildEnv(overrides: Partial<WorkerEnv> = {}): { env: WorkerEnv; assetsFetch: ReturnType<typeof vi.fn> } {
  const assetsFetch = vi.fn().mockResolvedValue(new Response(null, { status: 404 }))
  const env: WorkerEnv = {
    ASSETS: { fetch: assetsFetch } as unknown as Fetcher,
    ...overrides,
  }
  return { env, assetsFetch }
}

describe('createWorkerFetch', () => {
  it('forwards to handler when no auth env is configured and asset is missing', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }))
    const fetch = createWorkerFetch(handler)
    const { env } = buildEnv()
    const response = await fetch(buildRequest({}), env)
    expect(handler).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('ok')
  })

  it('returns the static asset when ASSETS has a match', async () => {
    const handler = vi.fn()
    const fetch = createWorkerFetch(handler)
    const { env, assetsFetch } = buildEnv()
    assetsFetch.mockResolvedValue(new Response('asset-body', { status: 200 }))
    const response = await fetch(buildRequest({}), env)
    expect(handler).not.toHaveBeenCalled()
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('asset-body')
  })

  it('forwards when only BASIC_AUTH_USER is set (auth not enforced)', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('ok'))
    const fetch = createWorkerFetch(handler)
    const { env } = buildEnv({ BASIC_AUTH_USER: USER })
    const response = await fetch(buildRequest({}), env)
    expect(handler).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
  })

  it('forwards when only BASIC_AUTH_PASS is set (auth not enforced)', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('ok'))
    const fetch = createWorkerFetch(handler)
    const { env } = buildEnv({ BASIC_AUTH_PASS: PASS })
    const response = await fetch(buildRequest({}), env)
    expect(handler).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
  })

  it('returns 401 without consulting ASSETS or handler when auth required and header missing', async () => {
    const handler = vi.fn()
    const fetch = createWorkerFetch(handler)
    const { env, assetsFetch } = buildEnv({ BASIC_AUTH_USER: USER, BASIC_AUTH_PASS: PASS })
    const response = await fetch(buildRequest({}), env)
    expect(handler).not.toHaveBeenCalled()
    expect(assetsFetch).not.toHaveBeenCalled()
    expect(response.status).toBe(401)
    expect(response.headers.get('WWW-Authenticate')).toContain('Basic')
  })

  it('returns 401 without consulting ASSETS or handler when credentials are wrong', async () => {
    const handler = vi.fn()
    const fetch = createWorkerFetch(handler)
    const { env, assetsFetch } = buildEnv({ BASIC_AUTH_USER: USER, BASIC_AUTH_PASS: PASS })
    const response = await fetch(buildRequest({ authHeader: basicHeader('wrong', 'wrong') }), env)
    expect(handler).not.toHaveBeenCalled()
    expect(assetsFetch).not.toHaveBeenCalled()
    expect(response.status).toBe(401)
  })

  it('forwards to handler when auth required, credentials correct, and asset is missing', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('ssr', { status: 200 }))
    const fetch = createWorkerFetch(handler)
    const { env, assetsFetch } = buildEnv({ BASIC_AUTH_USER: USER, BASIC_AUTH_PASS: PASS })
    const response = await fetch(buildRequest({ authHeader: basicHeader(USER, PASS) }), env)
    expect(assetsFetch).toHaveBeenCalledOnce()
    expect(handler).toHaveBeenCalledOnce()
    expect(await response.text()).toBe('ssr')
  })

  it('returns asset (after auth pass) without invoking handler when ASSETS has a match', async () => {
    const handler = vi.fn()
    const fetch = createWorkerFetch(handler)
    const { env, assetsFetch } = buildEnv({ BASIC_AUTH_USER: USER, BASIC_AUTH_PASS: PASS })
    assetsFetch.mockResolvedValue(new Response('asset-body', { status: 200 }))
    const response = await fetch(buildRequest({ authHeader: basicHeader(USER, PASS) }), env)
    expect(handler).not.toHaveBeenCalled()
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('asset-body')
  })

  it('passes through the original Request to the handler', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('ok'))
    const fetch = createWorkerFetch(handler)
    const { env } = buildEnv()
    const request = buildRequest({})
    await fetch(request, env)
    expect(handler).toHaveBeenCalledWith(request)
  })

  describe.each(['POST', 'PUT', 'DELETE', 'PATCH'])('non-GET method (%s)', (method) => {
    it('skips ASSETS and goes straight to handler', async () => {
      const handler = vi.fn().mockResolvedValue(new Response('ok'))
      const fetch = createWorkerFetch(handler)
      const { env, assetsFetch } = buildEnv()
      const response = await fetch(buildRequest({ method }), env)
      expect(assetsFetch).not.toHaveBeenCalled()
      expect(handler).toHaveBeenCalledOnce()
      expect(response.status).toBe(200)
    })

    it('still rejects with 401 when auth fails before reaching handler', async () => {
      const handler = vi.fn()
      const fetch = createWorkerFetch(handler)
      const { env, assetsFetch } = buildEnv({ BASIC_AUTH_USER: USER, BASIC_AUTH_PASS: PASS })
      const response = await fetch(buildRequest({ method }), env)
      expect(assetsFetch).not.toHaveBeenCalled()
      expect(handler).not.toHaveBeenCalled()
      expect(response.status).toBe(401)
    })
  })

  it('uses ASSETS for HEAD requests (same routing as GET)', async () => {
    const handler = vi.fn()
    const fetch = createWorkerFetch(handler)
    const { env, assetsFetch } = buildEnv()
    assetsFetch.mockResolvedValue(new Response(null, { status: 200 }))
    const response = await fetch(buildRequest({ method: 'HEAD' }), env)
    expect(assetsFetch).toHaveBeenCalledOnce()
    expect(handler).not.toHaveBeenCalled()
    expect(response.status).toBe(200)
  })
})
