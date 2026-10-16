import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { API_URL } from '../env.ts'
import { apiClient, apiErrorResponse } from './api-client.ts'

describe('apiClient', () => {
  it('GETs the path under API_URL, uncached, and parses the JSON', async (t) => {
    const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ ok: 1 }))
    const result = await apiClient<{ ok: number }>('/drinks?cnt=1')

    assert.deepEqual(result, { success: true, data: { ok: 1 } })
    const [url, init] = fetch.mock.calls[0]?.arguments ?? []
    assert.equal(String(url), `${API_URL}/drinks?cnt=1`)
    assert.equal((init as RequestInit | undefined)?.cache, 'no-store')
  })

  it('reports a non-2xx status with its text', async (t) => {
    t.mock.method(console, 'error', () => {})
    t.mock.method(
      globalThis,
      'fetch',
      async () => new Response(null, { status: 404, statusText: 'Not Found' })
    )

    assert.deepEqual(await apiClient('/x'), { success: false, status: 404, message: 'Not Found' })
  })

  it('reports a network failure without a status', async (t) => {
    t.mock.method(console, 'error', () => {})
    t.mock.method(globalThis, 'fetch', async () => {
      throw new TypeError('fetch failed')
    })

    assert.deepEqual(await apiClient('/x'), {
      success: false,
      status: null,
      message: 'fetch failed',
    })
  })

  it('falls back to the status when there is no status text, as over HTTP/2', async (t) => {
    t.mock.method(console, 'error', () => {})
    t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 503 }))

    assert.deepEqual(await apiClient('/x'), {
      success: false,
      status: 503,
      message: 'API error 503',
    })
  })

  it('reports a body that is not JSON without its success status', async (t) => {
    t.mock.method(console, 'error', () => {})
    for (const response of [new Response('<html>'), new Response(null, { status: 204 })]) {
      t.mock.method(globalThis, 'fetch', async () => response)
      const result = await apiClient('/x')

      assert.deepEqual(result, { success: false, status: null, message: 'JSON parse error' })
      if (!result.success) assert.equal(apiErrorResponse(result).status, 500)
    }
  })
})

describe('apiErrorResponse', () => {
  it("passes the API's status through, and makes a missing one a 500", async () => {
    const notFound = apiErrorResponse({ success: false, status: 404, message: 'Not Found' })
    const unreachable = apiErrorResponse({ success: false, status: null, message: 'x' })

    assert.equal(notFound.status, 404)
    assert.equal(await notFound.text(), 'Not Found')
    assert.equal(unreachable.status, 500)
  })
})
