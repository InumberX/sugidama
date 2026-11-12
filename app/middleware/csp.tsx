// Content-Security-Policy with a per-request nonce, on Remix's own `csp()`.
//
// `csp()` establishes the nonce and sends the policy; `render()`, which runs
// inside it, stamps that nonce on everything the renderer writes itself — the
// `<style data-rmx-style>` tags `css(...)` emits, the import map and the
// preloads — so `style-src` needs no `'unsafe-inline'`. A server-rendered
// `<Frame src>` resolves through an internal request that inherits the same
// nonce. For the scripts `Document` writes itself, `renderWithCsp()` also wraps
// every page in `CspNonceProvider`, and components read the nonce back through
// component context (app/ui/contexts/csp-nonce/): a component has no request
// context of its own to call `getCspNonce()` with.
import { csp, type CspNonce, getCspNonce } from 'remix/middleware/csp'
import { render, Renderer, type RenderFunction, type RenderOptions } from 'remix/middleware/render'
import type { Middleware } from 'remix/router'

import { API_URL } from '../env.ts'
import { CspNonceProvider } from '../ui/contexts/csp-nonce/csp-nonce.tsx'
import { mediaTypeOf } from './with-headers.ts'

const NONCE_PLACEHOLDER = '{{nonce}}'

// A CSP source whose path does not end in `/` matches that exact path only, so
// API_URL (stored without a trailing slash) would allow `/rcms-api/7` but not
// `/rcms-api/7/content/list`. The slash makes it a prefix.
const API_SOURCE = `${API_URL}/`

/**
 * develop's app/server/csp.server.ts, minus `https://*.sentry.io` in
 * `connect-src`: no Sentry SDK exists on either branch, so allowing it only
 * widened where an injected script could send data. Add it back with the SDK.
 * `'strict-dynamic'` lets the nonce'd gtag.js load the scripts it needs;
 * browsers that support it ignore the host list, which stays for older ones.
 */
const DIRECTIVES: Record<string, string[]> = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    `'nonce-${NONCE_PLACEHOLDER}'`,
    "'strict-dynamic'",
    'https://www.googletagmanager.com',
  ],
  // The nonce covers the <style> tags render() writes; nothing renders a
  // `style` attribute, which no nonce can cover.
  'style-src': ["'self'", `'nonce-${NONCE_PLACEHOLDER}'`, 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    API_SOURCE,
    'https://afterworks.g.kuroco-img.app',
    'https://www.google.co.jp',
  ],
  'connect-src': [
    "'self'",
    'https://www.googletagmanager.com',
    'https://www.google.com',
    'https://*.google-analytics.com',
    'https://analytics.google.com',
    API_SOURCE,
  ],
  'frame-src': ["'self'", 'https://www.googletagmanager.com'],
  'media-src': ["'self'", 'blob:'],
  'worker-src': ["'self'", 'blob:'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
}

// Everything but the nonce is fixed for the life of the Worker, so the policy
// is joined once and only the nonce is substituted per request — every
// occurrence, since script-src and style-src both carry it.
const POLICY_TEMPLATE = Object.entries(DIRECTIVES)
  .map(([name, sources]) => `${name} ${sources.join(' ')}`)
  .join('; ')

export const buildCspDirective = (nonce: string): string =>
  POLICY_TEMPLATE.replaceAll(NONCE_PLACEHOLDER, nonce)

/**
 * The same test Remix's render() applies to frame responses: media type only,
 * any case. A copy of `isHtmlResponse()` in
 * @remix-run/render-middleware/src/lib/render-ui.ts, which is not exported;
 * keep the two in step when Remix is upgraded.
 */
const isHtml = (response: Response): boolean => mediaTypeOf(response) === 'text/html'

/**
 * Only `text/html` without a policy of its own gets the nonce policy: a nonce
 * means nothing on a 404 in plain text or a redirect, and a route that sets its
 * own CSP keeps it alone — `csp()` would otherwise add its policy beside the
 * route's, and the browser enforces both. Everything else gets
 * securityHeaders()'s fallback.
 */
export const takesNoncePolicy = (response: Response): boolean =>
  isHtml(response) && !response.headers.has('Content-Security-Policy')

/**
 * `csp()` and `render()` as one middleware, so `render()` always runs inside
 * the `csp()` whose nonce it stamps — there is no middleware order to get
 * wrong. The renderer is then replaced with one that wraps every page in
 * `CspNonceProvider`, for the scripts `Document` writes itself.
 *
 * Unlike develop it is sent in development too: without Vite's HMR there is no
 * inline script the policy would have to exempt, so a violation shows up under
 * `wrangler dev` first.
 */
export const renderWithCsp = (
  options?: RenderOptions
): Middleware<
  readonly [
    { key: typeof CspNonce; value: string },
    { key: typeof Renderer; value: RenderFunction; property: 'render' },
  ]
> => {
  const cspMiddleware = csp({
    policy: ({ nonce }) => buildCspDirective(nonce),
    filter: takesNoncePolicy,
  })
  const renderMiddleware = render(options)

  return (context, next) =>
    cspMiddleware(context, async () =>
      renderMiddleware(context, async () => {
        // csp() above established it; render() read the same one.
        const nonce = getCspNonce(context)
        // AnyRenderer is all the key's type says; render() above is what put a
        // RenderFunction there, so the cast restates what this function owns.
        const renderPage = context.get(Renderer) as RenderFunction
        const renderWithNonce: RenderFunction = (node, init) =>
          renderPage(<CspNonceProvider nonce={nonce}>{node}</CspNonceProvider>, init)
        // Same key and property as render() used, so this replaces the renderer
        // rather than adding a second one; `context.render` now returns this.
        context.set(Renderer, renderWithNonce, { property: 'render' })
        return next()
      })
    )
}
