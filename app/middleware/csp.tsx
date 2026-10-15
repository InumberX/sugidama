// Content-Security-Policy with a per-request nonce.
//
// Remix 3.0.0 has no nonce option of its own: neither `render()` nor
// `renderToStream()` accepts one, and the `<style data-rmx-style>` tags that
// `css(...)` emits cannot carry one. So `renderWithCsp()` installs the standard
// renderer, wraps every page it renders in `CspNonceProvider`, and `Document`
// reads the nonce back through component context (app/ui/contexts/csp-nonce/)
// for the scripts it writes itself. Styles stay on `'unsafe-inline'` until Remix stamps its own tags —
// https://github.com/remix-run/remix/pull/11926 adds a `nonce` option to
// `renderToStream()` for exactly that (tracked in issue #115).
//
// Frames are not covered yet: `render()` resolves a `<Frame src>` through an
// internal `router.fetch`, which would mint a second nonce that the outer page's
// header does not list. Nothing renders a Frame today; #11926 also makes frames
// reuse the document's nonce, so revisit this when either changes.
import { render, Renderer, type RenderFunction, type RenderOptions } from 'remix/middleware/render'
import type { Middleware } from 'remix/router'

import { API_URL } from '../env.ts'
import { CspNonceProvider } from '../ui/contexts/csp-nonce/csp-nonce.tsx'
import { withHeaders } from './with-headers.ts'

/** 128 random bits, base64 — the size the CSP spec recommends at minimum. */
export const createNonce = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return btoa(String.fromCharCode(...bytes))
}

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
  // `'unsafe-inline'` because Remix's own <style> tags carry no nonce yet.
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
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
// occurrence, since style-src will take it too once remix#11926 ships.
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
const isHtml = (response: Response): boolean =>
  response.headers.get('Content-Type')?.split(';', 1)[0]?.trim().toLowerCase() === 'text/html'

/**
 * `render()` plus the CSP: installs the standard renderer, then replaces it with
 * one that wraps every page in `CspNonceProvider`, and sends the matching
 * Content-Security-Policy header on HTML responses. Built on `render()` rather
 * than placed after it, so there is no middleware order to get wrong.
 *
 * Only `text/html` without a policy of its own gets the nonce policy: a nonce
 * means nothing on a 404 in plain text or a redirect, and a route that sets
 * its own CSP keeps it. Everything else gets securityHeaders()'s fallback.
 *
 * Unlike develop it is sent in development too: without Vite's HMR there is no
 * inline script the policy would have to exempt, so a violation shows up under
 * `wrangler dev` first.
 */
export const renderWithCsp = (
  options?: RenderOptions
): Middleware<{ key: typeof Renderer; value: RenderFunction; property: 'render' }> => {
  const renderMiddleware = render(options)

  return (context, next) =>
    renderMiddleware(context, async () => {
      // Created on first use — a page render or the HTML header — so a
      // redirect or a plain-text 404 never pays for one.
      let nonce: string | undefined
      const getNonce = () => (nonce ??= createNonce())

      // AnyRenderer is all the key's type says; render() above is what put a
      // RenderFunction there, so the cast restates what this function owns.
      const renderPage = context.get(Renderer) as RenderFunction
      const renderWithNonce: RenderFunction = (node, init) =>
        renderPage(<CspNonceProvider nonce={getNonce()}>{node}</CspNonceProvider>, init)
      // Same key and property as render() used, so this replaces the renderer
      // rather than adding a second one; `context.render` now returns this.
      context.set(Renderer, renderWithNonce, { property: 'render' })

      const response = await next()
      if (!isHtml(response) || response.headers.has('Content-Security-Policy')) return response
      return withHeaders(response, { 'Content-Security-Policy': buildCspDirective(getNonce()) })
    })
}
