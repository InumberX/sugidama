// Content-Security-Policy with a per-request nonce.
//
// Remix 3.0.0 has no nonce option of its own: neither `render()` nor
// `renderToStream()` accepts one, and the `<style data-rmx-style>` tags that
// `css(...)` emits cannot carry one. So `renderWithCsp()` installs the standard
// renderer, wraps every page it renders in `CspNonceProvider`, and `Document`
// reads the nonce back through component context for the scripts it writes
// itself. Styles stay on `'unsafe-inline'` until Remix stamps its own tags —
// https://github.com/remix-run/remix/pull/11926 adds a `nonce` option to
// `renderToStream()` for exactly that (tracked in issue #115).
//
// Frames are not covered yet: `render()` resolves a `<Frame src>` through an
// internal `router.fetch`, which would mint a second nonce that the outer page's
// header does not list. Nothing renders a Frame today; #11926 also makes frames
// reuse the document's nonce, so revisit this when either changes.
import type { Handle, RemixNode } from 'remix/component'
import { render, Renderer, type RenderFunction, type RenderOptions } from 'remix/middleware/render'
import type { Middleware } from 'remix/router'

import { API_URL } from '../env.ts'
import { withHeaders } from './with-headers.ts'

type CspNonceContext = { nonce: string }

/**
 * Makes the request's nonce available to every component below it, so a page
 * does not have to thread it through props. Installed by `renderWithCsp()`;
 * read it with `useCspNonce(handle)`.
 */
export function CspNonceProvider(
  handle: Handle<{ nonce: string; children?: RemixNode }, CspNonceContext>
) {
  handle.context.set({ nonce: handle.props.nonce })
  return () => handle.props.children
}

/**
 * The nonce for scripts this component renders, or `undefined` outside a
 * request (a component rendered on its own in a test, `/dev/ui` specimens).
 * Call it in setup, like any context read.
 */
export const useCspNonce = (handle: Handle<object>): string | undefined =>
  handle.context.get(CspNonceProvider)?.nonce

/** 128 random bits, base64 — the size the CSP spec recommends at minimum. */
export const createNonce = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return btoa(String.fromCharCode(...bytes))
}

const NONCE_PLACEHOLDER = '{{nonce}}'

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
    API_URL,
    'https://afterworks.g.kuroco-img.app',
    'https://www.google.co.jp',
  ],
  'connect-src': [
    "'self'",
    'https://www.googletagmanager.com',
    'https://www.google.com',
    'https://*.google-analytics.com',
    'https://analytics.google.com',
    API_URL,
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
// is joined once and only the nonce is substituted per request.
const POLICY_TEMPLATE = Object.entries(DIRECTIVES)
  .map(([name, sources]) => `${name} ${sources.join(' ')}`)
  .join('; ')

export const buildCspDirective = (nonce: string): string =>
  POLICY_TEMPLATE.replace(NONCE_PLACEHOLDER, nonce)

/**
 * `render()` plus the CSP: installs the standard renderer, then replaces it with
 * one that wraps every page in `CspNonceProvider`, and sends the matching
 * Content-Security-Policy header. Built on `render()` rather than placed after
 * it, so there is no middleware order to get wrong.
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
      const nonce = createNonce()
      const renderPage = context.get(Renderer) as RenderFunction
      const renderWithNonce: RenderFunction = (node, init) =>
        renderPage(<CspNonceProvider nonce={nonce}>{node}</CspNonceProvider>, init)
      // Same key and property as render() used, so this replaces the renderer
      // rather than adding a second one; `context.render` now returns this.
      context.set(Renderer, renderWithNonce, { property: 'render' })

      return withHeaders(await next(), { 'Content-Security-Policy': buildCspDirective(nonce) })
    })
}
