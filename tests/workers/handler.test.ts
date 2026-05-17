import { describe, it, expect, vi } from 'vitest'

import { createHandleWorkerRequest, type WorkerEnv } from '../../workers/handler'

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

// Project-specific wiring tests. Library behavior (Basic-auth parsing, timing-
// safe compare, etc.) is owned by `@inumberx/cloudflare-workers-basic-auth`;
// these tests only assert that `workers/handler.ts` wires that library to the
// project's env shape, realm, and operational guarantees (fail-closed, asset
// routing).
describe('createHandleWorkerRequest', () => {
  it('wires env.ASSETS so a matching static asset short-circuits the handler', async () => {
    const handler = vi.fn()
    const fetch = createHandleWorkerRequest(handler)
    const { env, assetsFetch } = buildEnv()
    assetsFetch.mockResolvedValue(new Response('asset-body', { status: 200 }))
    const response = await fetch(buildRequest({}), env)
    expect(assetsFetch).toHaveBeenCalledOnce()
    expect(handler).not.toHaveBeenCalled()
    expect(await response.text()).toBe('asset-body')
  })

  it('falls back to the SSR handler when ASSETS responds 404', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('ssr', { status: 200 }))
    const fetch = createHandleWorkerRequest(handler)
    const { env } = buildEnv()
    const response = await fetch(buildRequest({}), env)
    expect(handler).toHaveBeenCalledOnce()
    expect(await response.text()).toBe('ssr')
  })

  it('fails closed with 503 when only BASIC_AUTH_USER is set', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const handler = vi.fn()
    const fetch = createHandleWorkerRequest(handler)
    const { env, assetsFetch } = buildEnv({ BASIC_AUTH_USER: USER })
    const response = await fetch(buildRequest({}), env)
    expect(handler).not.toHaveBeenCalled()
    expect(assetsFetch).not.toHaveBeenCalled()
    expect(response.status).toBe(503)
  })

  it('fails closed with 503 when only BASIC_AUTH_PASS is set', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const handler = vi.fn()
    const fetch = createHandleWorkerRequest(handler)
    const { env, assetsFetch } = buildEnv({ BASIC_AUTH_PASS: PASS })
    const response = await fetch(buildRequest({}), env)
    expect(handler).not.toHaveBeenCalled()
    expect(assetsFetch).not.toHaveBeenCalled()
    expect(response.status).toBe(503)
  })

  it('reads credentials from env.BASIC_AUTH_USER / env.BASIC_AUTH_PASS', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('ssr'))
    const fetch = createHandleWorkerRequest(handler)
    const { env } = buildEnv({ BASIC_AUTH_USER: USER, BASIC_AUTH_PASS: PASS })
    const response = await fetch(buildRequest({ authHeader: basicHeader(USER, PASS) }), env)
    expect(handler).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
  })

  it("uses 'Sugidama' as the Basic-auth realm in the 401 challenge", async () => {
    const handler = vi.fn()
    const fetch = createHandleWorkerRequest(handler)
    const { env } = buildEnv({ BASIC_AUTH_USER: USER, BASIC_AUTH_PASS: PASS })
    const response = await fetch(buildRequest({}), env)
    expect(response.status).toBe(401)
    expect(response.headers.get('WWW-Authenticate')).toContain('Sugidama')
  })

  it('skips ASSETS for non-GET/HEAD requests so form/CSRF routes are not shadowed', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('ok'))
    const fetch = createHandleWorkerRequest(handler)
    const { env, assetsFetch } = buildEnv()
    const response = await fetch(buildRequest({ method: 'POST' }), env)
    expect(assetsFetch).not.toHaveBeenCalled()
    expect(handler).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
  })

  it('routes HEAD requests through ASSETS like GET', async () => {
    const handler = vi.fn()
    const fetch = createHandleWorkerRequest(handler)
    const { env, assetsFetch } = buildEnv()
    assetsFetch.mockResolvedValue(new Response(null, { status: 200 }))
    const response = await fetch(buildRequest({ method: 'HEAD' }), env)
    expect(assetsFetch).toHaveBeenCalledOnce()
    expect(handler).not.toHaveBeenCalled()
    expect(response.status).toBe(200)
  })
})
