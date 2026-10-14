import * as assert from 'remix/assert'
import { describe, it, type TestContext } from 'remix/test'

import { createHandleWorkerRequest, type WorkerEnv } from './handler.ts'

const USER = 'admin'
const PASS = 'secret'

const basicHeader = (user: string, pass: string): string => {
  const bytes = new TextEncoder().encode(`${user}:${pass}`)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return `Basic ${btoa(binary)}`
}

const buildRequest = (options: { method?: string; authHeader?: string } = {}): Request => {
  const { method = 'GET', authHeader } = options
  const headers = new Headers()
  if (authHeader !== undefined) {
    headers.set('Authorization', authHeader)
  }
  return new Request('https://example.com/', { method, headers })
}

const buildEnv = (
  t: TestContext,
  options: { assetResponse?: () => Response; env?: Partial<WorkerEnv> } = {}
) => {
  const { assetResponse = () => new Response(null, { status: 404 }), env: overrides } = options
  const assetsFetch = t.mock.fn((_request: Request) => assetResponse())
  const env: WorkerEnv = { ASSETS: { fetch: assetsFetch }, ...overrides }
  return { env, assetsFetch }
}

const buildHandler = (t: TestContext, body = 'ssr') =>
  t.mock.fn((_request: Request) => new Response(body, { status: 200 }))

// Project-specific wiring tests. Library behavior (Basic-auth parsing, timing-
// safe compare, etc.) is owned by `@inumberx/cloudflare-workers-basic-auth`;
// these tests only assert that `workers/handler.ts` wires that library to the
// project's env shape, realm, and operational guarantees (fail-closed, asset
// routing).
describe('createHandleWorkerRequest', () => {
  it('wires env.ASSETS so a matching static asset short-circuits the handler', async (t) => {
    const handler = buildHandler(t)
    const { env, assetsFetch } = buildEnv(t, {
      assetResponse: () => new Response('asset-body', { status: 200 }),
    })
    const response = await createHandleWorkerRequest(handler)(buildRequest(), env)
    assert.equal(assetsFetch.mock.calls.length, 1)
    assert.equal(handler.mock.calls.length, 0)
    assert.equal(await response.text(), 'asset-body')
  })

  it('falls back to the app handler when ASSETS responds 404', async (t) => {
    const handler = buildHandler(t)
    const { env } = buildEnv(t)
    const response = await createHandleWorkerRequest(handler)(buildRequest(), env)
    assert.equal(handler.mock.calls.length, 1)
    assert.equal(await response.text(), 'ssr')
  })

  it('fails closed with 503 when only BASIC_AUTH_USER is set', async (t) => {
    t.mock.method(console, 'error', () => {})
    const handler = buildHandler(t)
    const { env, assetsFetch } = buildEnv(t, { env: { BASIC_AUTH_USER: USER } })
    const response = await createHandleWorkerRequest(handler)(buildRequest(), env)
    assert.equal(handler.mock.calls.length, 0)
    assert.equal(assetsFetch.mock.calls.length, 0)
    assert.equal(response.status, 503)
  })

  it('fails closed with 503 when only BASIC_AUTH_PASS is set', async (t) => {
    t.mock.method(console, 'error', () => {})
    const handler = buildHandler(t)
    const { env, assetsFetch } = buildEnv(t, { env: { BASIC_AUTH_PASS: PASS } })
    const response = await createHandleWorkerRequest(handler)(buildRequest(), env)
    assert.equal(handler.mock.calls.length, 0)
    assert.equal(assetsFetch.mock.calls.length, 0)
    assert.equal(response.status, 503)
  })

  it('reads credentials from env.BASIC_AUTH_USER / env.BASIC_AUTH_PASS', async (t) => {
    const handler = buildHandler(t)
    const { env } = buildEnv(t, { env: { BASIC_AUTH_USER: USER, BASIC_AUTH_PASS: PASS } })
    const response = await createHandleWorkerRequest(handler)(
      buildRequest({ authHeader: basicHeader(USER, PASS) }),
      env
    )
    assert.equal(handler.mock.calls.length, 1)
    assert.equal(response.status, 200)
  })

  it("uses 'Sugidama' as the Basic-auth realm in the 401 challenge", async (t) => {
    const handler = buildHandler(t)
    const { env } = buildEnv(t, { env: { BASIC_AUTH_USER: USER, BASIC_AUTH_PASS: PASS } })
    const response = await createHandleWorkerRequest(handler)(buildRequest(), env)
    assert.equal(response.status, 401)
    assert.match(response.headers.get('WWW-Authenticate') ?? '', /Sugidama/)
  })

  it('skips ASSETS for non-GET/HEAD requests so form/CSRF routes are not shadowed', async (t) => {
    const handler = buildHandler(t, 'ok')
    const { env, assetsFetch } = buildEnv(t)
    const response = await createHandleWorkerRequest(handler)(buildRequest({ method: 'POST' }), env)
    assert.equal(assetsFetch.mock.calls.length, 0)
    assert.equal(handler.mock.calls.length, 1)
    assert.equal(response.status, 200)
  })

  it('routes HEAD requests through ASSETS like GET', async (t) => {
    const handler = buildHandler(t)
    const { env, assetsFetch } = buildEnv(t, {
      assetResponse: () => new Response(null, { status: 200 }),
    })
    const response = await createHandleWorkerRequest(handler)(buildRequest({ method: 'HEAD' }), env)
    assert.equal(assetsFetch.mock.calls.length, 1)
    assert.equal(handler.mock.calls.length, 0)
    assert.equal(response.status, 200)
  })
})
