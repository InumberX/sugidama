// Ported from develop: app/server/api/client.server.ts and error.server.ts
//
// The one place the app talks to the Kuroco API. Every call resolves to a
// result instead of throwing, so an action decides what a failure means.
import { API_URL, CACHE_BUSTER, SITE_URL } from '../env.ts'
import { HTTP_STATUS } from '../utils/http-status.ts'

type ApiSuccess<T> = { success: true; data: T }

export type ApiError = {
  success: false
  /** The API's error status, or `null` when there is none to pass on (no response, or a body that is not JSON). */
  status: number | null
  message: string
}

export type ApiResult<T> = ApiSuccess<T> | ApiError

/** A query parameter's value; an array repeats the name (`tag_id=11&tag_id=21`), `undefined` leaves it out. */
export type ApiParamValue = string | number | readonly (string | number)[] | undefined

export type ApiParams = Record<string, ApiParamValue>

/** How long a successful answer is reused before the API is asked again. */
export const API_CACHE_MAX_AGE_SECONDS = 300

/** The prefix of every cache key: no page of the site lives under it. */
const API_CACHE_PATH = '/__cache'

/**
 * The URL the API is asked: `endpoint` under `API_URL`, with `params` as the
 * query in the order they are given. `endpoint` is a path the caller has
 * already encoded (`/drinks/${encodeURIComponent(id)}`).
 */
export const toApiUrl = (endpoint: string, params: ApiParams = {}): URL => {
  const url = new URL(`${API_URL}${endpoint}`)
  for (const [name, value] of Object.entries(params)) {
    if (value === undefined) continue
    for (const item of [value].flat()) url.searchParams.append(name, String(item))
  }
  return url
}

/**
 * The cache key for an answer from `apiUrl`: the API's own path and query
 * under this site's origin and the deploy's `CACHE_BUSTER`. Built from the
 * URL actually requested, so no parameter can reach the API without reaching
 * the key; the origin keeps staging and production apart, and the buster
 * drops every answer a previous deploy stored. Nothing ever requests it.
 */
export const toCacheUrl = (apiUrl: URL): string =>
  `${new URL(SITE_URL).origin}${API_CACHE_PATH}/${CACHE_BUSTER}${apiUrl.pathname}${apiUrl.search}`

type ApiCache = Pick<Cache, 'match' | 'put'>

/**
 * The Workers cache of the data center the request runs in. `wrangler dev`
 * has one too; Node (the tests) has none, so every call there asks the API.
 */
const getApiCache = (): ApiCache | undefined =>
  (globalThis as { caches?: { default?: ApiCache } }).caches?.default

/** A stored answer, or `undefined` when there is none or it cannot be read. */
const readCache = async (cache: ApiCache, key: string): Promise<{ data: unknown } | undefined> => {
  try {
    const response = await cache.match(key)
    if (!response) return undefined
    return { data: JSON.parse(await response.text()) }
  } catch {
    return undefined
  }
}

/** Stores a successful answer's body; a cache that fails only costs the next call a request. */
const writeCache = async (cache: ApiCache, key: string, body: string): Promise<void> => {
  const response = new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `max-age=${API_CACHE_MAX_AGE_SECONDS}`,
    },
  })
  await cache.put(key, response).catch((error: unknown) => {
    console.error('[API] Cache write failed', error)
  })
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : typeof error === 'string' ? error : 'unexpected error'

/**
 * GETs `endpoint` under `API_URL` with `params` and parses the JSON body. A
 * successful answer is kept in the Workers cache for
 * `API_CACHE_MAX_AGE_SECONDS` and reused from there; an error is never kept,
 * so the site recovers as soon as the API does.
 */
export const apiClient = async <T>(endpoint: string, params?: ApiParams): Promise<ApiResult<T>> => {
  const apiUrl = toApiUrl(endpoint, params)
  const path = `${apiUrl.pathname}${apiUrl.search}`
  const cache = getApiCache()
  const cacheUrl = toCacheUrl(apiUrl)

  if (cache) {
    const cached = await readCache(cache, cacheUrl)
    if (cached) return { success: true, data: cached.data as T }
  }

  let response: Response

  try {
    // `no-store` keeps the runtime's own HTTP cache out; the Workers cache above is the one.
    response = await fetch(apiUrl, { cache: 'no-store' })
  } catch (error) {
    console.error(`[API] Network error: ${path}`, error)
    return { success: false, status: null, message: getErrorMessage(error) }
  }

  if (!response.ok) {
    console.error(`[API] ${response.status}: ${path}`)
    // Nothing reads an error body; release the connection instead of leaving it to GC.
    // A body that already failed rejects here; that must not turn into a throw.
    await response.body?.cancel().catch(() => {})
    // HTTP/2 has no reason phrase, so statusText is usually empty.
    return {
      success: false,
      status: response.status,
      message: response.statusText || `API error ${response.status}`,
    }
  }

  let body: string
  let data: T

  try {
    body = await response.text()
    data = JSON.parse(body) as T
  } catch {
    console.error(`[API] JSON parse error: ${path}`)
    // The status was a success (or a 204 that cannot carry a body), so passing it on
    // would answer an error with 200; develop did. Treat it as no usable answer.
    return { success: false, status: null, message: 'JSON parse error' }
  }

  if (cache) await writeCache(cache, cacheUrl, body)
  return { success: true, data }
}

export type VisitorStatusOptions = {
  /**
   * Whether the API's 404 means the page itself is not there — true only for
   * a lookup by the URL's own id (a drink). Anywhere else a 404 is the API's
   * problem (a renamed endpoint, a wrong API_URL), and passing it on would
   * turn the home page into a "not found" that crawlers drop.
   */
  notFound?: boolean
}

/**
 * The status a visitor gets for a failed call: a 404 the page itself owns
 * (`notFound`) stays a 404, and a 410 a 410; any other 4xx — a key it
 * rejects, a limit it hit, an endpoint it no longer has — is not the
 * visitor's fault and becomes a 502; its 5xx passes through; no usable answer
 * is a 500. develop passed every status through.
 */
export const toVisitorStatus = (
  { status }: Pick<ApiError, 'status'>,
  { notFound = false }: VisitorStatusOptions = {}
): number => {
  if (status === null) return HTTP_STATUS.INTERNAL_SERVER_ERROR
  // A lookup by the URL's own id: an id the API no longer has (410) is a
  // missing page too, and stays a 410 so crawlers drop it. A 400 is not: it
  // can as well be the API's own fault (a key, a changed rule), and as a 404
  // it would drop every drink at once.
  if (notFound && (status === HTTP_STATUS.NOT_FOUND || status === HTTP_STATUS.GONE)) return status
  return status >= HTTP_STATUS.INTERNAL_SERVER_ERROR ? status : HTTP_STATUS.BAD_GATEWAY
}

/**
 * The response an action returns for a failed call. Plain text with no detail
 * from the API — the error page middleware turns it into the site's page.
 */
export const apiErrorResponse = (error: ApiError, options?: VisitorStatusOptions): Response =>
  new Response(null, { status: toVisitorStatus(error, options) })
