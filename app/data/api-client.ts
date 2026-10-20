// Ported from develop: app/server/api/client.server.ts and error.server.ts
//
// The one place the app talks to the Kuroco API. Every call resolves to a
// result instead of throwing, so an action decides what a failure means.
import { API_URL } from '../env.ts'

type ApiSuccess<T> = { success: true; data: T }

export type ApiError = {
  success: false
  /** The API's error status, or `null` when there is none to pass on (no response, or a body that is not JSON). */
  status: number | null
  message: string
}

export type ApiResult<T> = ApiSuccess<T> | ApiError

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : typeof error === 'string' ? error : 'unexpected error'

/** GETs `${API_URL}${path}` and parses the JSON body, never cached. */
export const apiClient = async <T>(path: string): Promise<ApiResult<T>> => {
  let response: Response

  try {
    response = await fetch(`${API_URL}${path}`, { cache: 'no-store' })
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

  try {
    return { success: true, data: (await response.json()) as T }
  } catch {
    console.error(`[API] JSON parse error: ${path}`)
    // The status was a success (or a 204 that cannot carry a body), so passing it on
    // would answer an error with 200; develop did. Treat it as no usable answer.
    return { success: false, status: null, message: 'JSON parse error' }
  }
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
 * (`notFound`) stays a 404; any other 4xx — a key it rejects, a limit it hit,
 * an endpoint it no longer has — is not the visitor's fault and becomes a 502;
 * its 5xx passes through; no usable answer is a 500. develop passed every
 * status through.
 */
export const toVisitorStatus = (
  { status }: Pick<ApiError, 'status'>,
  { notFound = false }: VisitorStatusOptions = {}
): number => {
  if (status === null) return 500
  // A lookup by the URL's own id: an id the API no longer has (410) is a
  // missing page too. A 400 is not: it can as well be the API's own fault (a
  // key, a changed rule), and as a 404 it would drop every drink at once.
  if (notFound && (status === 404 || status === 410)) return 404
  return status >= 500 ? status : 502
}

/**
 * The response an action returns for a failed call. Plain text with no detail
 * from the API — the error page middleware turns it into the site's page.
 */
export const apiErrorResponse = (error: ApiError, options?: VisitorStatusOptions): Response =>
  new Response(null, { status: toVisitorStatus(error, options) })
