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
export const apiClient = async <T>(path: string, options?: RequestInit): Promise<ApiResult<T>> => {
  let response: Response

  try {
    response = await fetch(`${API_URL}${path}`, { cache: 'no-store', ...options })
  } catch (error) {
    console.error(`[API] Network error: ${path}`, error)
    return { success: false, status: null, message: getErrorMessage(error) }
  }

  if (!response.ok) {
    console.error(`[API] ${response.status}: ${path}`)
    // Nothing reads an error body; release the connection instead of leaving it to GC.
    await response.body?.cancel()
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

/**
 * The response an action returns for a failed call, as develop's loaders
 * threw it: the API's own status, or a 500 when nothing usable answered. Plain text
 * for now; the site's error page comes with step 9 of issue #115.
 */
export const apiErrorResponse = (error: ApiError): Response =>
  error.status === null
    ? new Response('Internal server error. Please try again later.', { status: 500 })
    : new Response(error.message, { status: error.status })
