import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { mockApiCache } from '../../test/kuroco.ts'
import { API_URL, CACHE_BUSTER, SITE_URL } from '../env.ts'
import {
  API_CACHE_MAX_AGE_SECONDS,
  apiClient,
  apiErrorResponse,
  toApiUrl,
  toCacheUrl,
} from './api-client.ts'

describe('apiClient', () => {
  it('GETs the endpoint under API_URL with its params, past any HTTP cache, and parses the JSON', async (t) => {
    const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ ok: 1 }))
    const result = await apiClient<{ ok: number }>('/drinks', { cnt: 1 })

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

  it('cancels an error body nothing reads, so the connection is released', async (t) => {
    t.mock.method(console, 'error', () => {})
    const cancel = t.mock.fn()
    const body = new ReadableStream({ cancel })
    t.mock.method(globalThis, 'fetch', async () => new Response(body, { status: 503 }))
    await apiClient('/x')

    assert.equal(cancel.mock.calls.length, 1)
  })

  it('still reports the status when cancelling a broken error body rejects', async (t) => {
    t.mock.method(console, 'error', () => {})
    const body = new ReadableStream({
      cancel: () => Promise.reject(new Error('connection reset')),
    })
    t.mock.method(globalThis, 'fetch', async () => new Response(body, { status: 503 }))

    assert.deepEqual(await apiClient('/x'), {
      success: false,
      status: 503,
      message: 'API error 503',
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

describe('toApiUrl', () => {
  it('puts the params in the query in their order, repeating an array and leaving out undefined', () => {
    const url = toApiUrl('/drinks', {
      cnt: 12,
      pageID: 2,
      tag_id: ['11', 21],
      filter: undefined,
      keyword: 'a b&c',
    })

    assert.equal(
      String(url),
      `${API_URL}/drinks?cnt=12&pageID=2&tag_id=11&tag_id=21&keyword=a+b%26c`
    )
  })

  it('adds no query without params', () => {
    assert.equal(String(toApiUrl('/tags/taste')), `${API_URL}/tags/taste`)
  })
})

describe('toCacheUrl', () => {
  it("keys the API's own path and query under the site and the deploy's cache buster", () => {
    const apiUrl = toApiUrl('/drinks', { cnt: 12, tag_id: [11, 21] })

    assert.equal(
      toCacheUrl(apiUrl),
      `${new URL(SITE_URL).origin}/__cache/${CACHE_BUSTER}${apiUrl.pathname}?cnt=12&tag_id=11&tag_id=21`
    )
  })
})

describe('apiClient with the Workers cache', () => {
  it('stores a successful answer for the max age and answers the next call from it', async (t) => {
    const cache = mockApiCache(t)
    const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ ok: 1 }))

    const first = await apiClient<{ ok: number }>('/drinks', { cnt: 1 })
    const second = await apiClient<{ ok: number }>('/drinks', { cnt: 1 })

    assert.deepEqual(first, { success: true, data: { ok: 1 } })
    assert.deepEqual(second, first)
    assert.equal(fetch.mock.calls.length, 1)
    const key = toCacheUrl(toApiUrl('/drinks', { cnt: 1 }))
    assert.deepEqual([...cache.store.keys()], [key])
    assert.equal(
      cache.store.get(key)?.headers.get('Cache-Control'),
      `max-age=${API_CACHE_MAX_AGE_SECONDS}`
    )
  })

  it('keeps answers to different params apart', async (t) => {
    mockApiCache(t)
    let n = 0
    const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ n: ++n }))

    const page1 = await apiClient('/drinks', { pageID: 1 })
    const page2 = await apiClient('/drinks', { pageID: 2 })

    assert.deepEqual(page1, { success: true, data: { n: 1 } })
    assert.deepEqual(page2, { success: true, data: { n: 2 } })
    assert.equal(fetch.mock.calls.length, 2)
  })

  it('never stores an error status, a network failure or a body that is not JSON', async (t) => {
    t.mock.method(console, 'error', () => {})
    const cache = mockApiCache(t)
    const answers = [
      async () => new Response(null, { status: 503 }),
      async () => {
        throw new TypeError('fetch failed')
      },
      async () => new Response('<html>'),
    ]
    for (const answer of answers) {
      t.mock.method(globalThis, 'fetch', answer)
      const result = await apiClient('/x')
      assert.equal(result.success, false)
    }

    assert.equal(cache.put.mock.calls.length, 0)
  })

  it('asks the API when the stored answer cannot be read, and still answers when storing fails', async (t) => {
    t.mock.method(console, 'error', () => {})
    const cache = mockApiCache(t)
    cache.store.set(toCacheUrl(toApiUrl('/x')), { body: '<broken', headers: new Headers() })
    const failingPut = t.mock.fn(async () => {
      throw new Error('cache full')
    })
    ;(globalThis as { caches?: unknown }).caches = {
      default: { match: cache.match, put: failingPut },
    }
    const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ ok: 1 }))

    assert.deepEqual(await apiClient('/x'), { success: true, data: { ok: 1 } })
    assert.equal(fetch.mock.calls.length, 1)
    assert.equal(failingPut.mock.calls.length, 1)
  })

  it('asks the API every time where there is no Workers cache', async (t) => {
    const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ ok: 1 }))
    await apiClient('/x')
    await apiClient('/x')

    assert.equal(fetch.mock.calls.length, 2)
  })
})

describe('apiErrorResponse', () => {
  it("passes a page's own 404 and the API's 5xx through, and tells the visitor nothing of the API", async () => {
    const notFound = apiErrorResponse(
      { success: false, status: 404, message: 'Not Found' },
      { notFound: true }
    )
    const down = apiErrorResponse({ success: false, status: 503, message: 'API error 503' })

    assert.equal(notFound.status, 404)
    assert.equal(await notFound.text(), '')
    assert.equal(down.status, 503)
  })

  it('keeps a missing or gone id as it is, but not one it rejects', () => {
    for (const status of [404, 410]) {
      const response = apiErrorResponse(
        { success: false, status, message: 'x' },
        { notFound: true }
      )
      assert.equal(response.status, status)
    }
    const forbidden = apiErrorResponse(
      { success: false, status: 403, message: 'x' },
      { notFound: true }
    )
    assert.equal(forbidden.status, 502)
  })

  it("makes the API's 404 a 502 where it names no missing page", () => {
    assert.equal(apiErrorResponse({ success: false, status: 404, message: 'x' }).status, 502)
  })

  it('makes any other 4xx a 502 and no usable answer a 500', () => {
    for (const status of [400, 401, 403, 429]) {
      assert.equal(
        apiErrorResponse({ success: false, status, message: 'x' }).status,
        502,
        String(status)
      )
    }
    assert.equal(apiErrorResponse({ success: false, status: null, message: 'x' }).status, 500)
  })
})
