// Every error the app answers in plain text — a route's 404, the router's own
// 404 for a path nothing matches, its 405, an API failure from
// `apiErrorResponse()` — leaves through here and becomes the site's error page,
// with the same status and headers (an `Allow` stays). One place, so every 404
// looks the same however it was reached.
//
// Router middleware, after renderWithCsp(): it needs the renderer that sets up,
// and the page it renders goes back out through it to get its CSP. What fails
// before the renderer — cop()'s 403, a thrown error's 500 — stays plain text,
// as does a response that names a type of its own (the sitemap's XML).
import { Renderer, type RenderFunction } from 'remix/middleware/render'
import type { Middleware } from 'remix/router'

import { ErrorPage } from '../actions/error-page.tsx'
import { DEFAULT_LANG, isLang, type Lang } from '../utils/i18n.ts'

/** No content type, or plain text: what this app's error responses carry. */
const isPlain = (response: Response): boolean => {
  const type = response.headers.get('Content-Type')
  return type === null || type.split(';')[0]!.trim().toLowerCase() === 'text/plain'
}

/**
 * The page's language from its path, as lang() would read it — decoded, so
 * `/%65n/…` is English there too — since the router's 404 has matched no
 * route and there is no `context.lang` to ask.
 */
export const langOfPath = (pathname: string): Lang => {
  let first = pathname.split('/')[1] ?? ''
  try {
    first = decodeURIComponent(first)
  } catch {
    // A malformed escape names no language.
  }
  return isLang(first) ? first : DEFAULT_LANG
}

/**
 * Headers the error page sets for itself: its type and length, and its CSP —
 * a policy carried over from the plain response (a `default-src 'none'`, say)
 * would stop renderWithCsp() from adding the nonce one, and block the page's
 * own scripts.
 */
const OWN_HEADERS = new Set(['content-type', 'content-length', 'content-security-policy'])

export const errorPage = (): Middleware => async (context, next) => {
  const response = await next()
  if (response.status < 400 || !isPlain(response)) return response

  const render = context.get(Renderer) as RenderFunction
  const page = await render(
    <ErrorPage
      lang={langOfPath(context.url.pathname)}
      url={context.url}
      status={response.status}
    />,
    { status: response.status }
  )
  // Keep what the error said besides its body: `Allow` on a 405, say.
  response.headers.forEach((value, name) => {
    if (!OWN_HEADERS.has(name.toLowerCase())) page.headers.set(name, value)
  })
  return page
}
