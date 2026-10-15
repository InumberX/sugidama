// Content-Security-Policy with a per-request nonce.
//
// Remix 3.0.0 has no nonce option of its own: neither `render()` nor
// `renderToStream()` accepts one, and the `<style data-rmx-style>` tags that
// `css(...)` emits cannot carry one. So this middleware creates the nonce,
// re-installs `context.render` to wrap every page in `CspNonceProvider`, and
// `Document` reads it back through component context for the scripts it
// writes itself. Styles stay on `'unsafe-inline'` until Remix stamps its own
// tags — https://github.com/remix-run/remix/pull/11926 adds a `nonce` option to
// `renderToStream()` for exactly that (see issue #115).
import type { Handle, RemixNode } from 'remix/component'
import { Renderer, type RenderFunction } from 'remix/middleware/render'
import { createContextKey, type Middleware } from 'remix/router'

import { API_URL } from '../env.ts'

/** The current request's nonce, also installed as `context.cspNonce`. */
export const CspNonce = createContextKey<string>()

type CspNonceContext = { nonce: string }

/**
 * Makes the request's nonce available to every component below it, so a page
 * does not have to thread it through props. Installed by `csp()`; read it with
 * `useCspNonce(handle)`.
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

/**
 * The policy, ported from develop's app/server/csp.server.ts. `'strict-dynamic'`
 * lets the nonce'd gtag.js load the scripts it needs; browsers that support it
 * ignore the host list, which stays for older ones.
 */
export const buildCspDirective = (nonce: string): string => {
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
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

  return Object.entries(directives)
    .map(([name, sources]) => `${name} ${sources.join(' ')}`)
    .join('; ')
}

/**
 * Creates the request's nonce, makes every `context.render` pass it down, and
 * sends the matching Content-Security-Policy header.
 *
 * Must run after `render()`, whose renderer it wraps. Unlike develop it is sent
 * in development too: without Vite's HMR there is no inline script the policy
 * would have to exempt, so a violation shows up under `wrangler dev` first.
 */
export const csp =
  (): Middleware<{ key: typeof CspNonce; value: string; property: 'cspNonce' }> =>
  async (context, next) => {
    const nonce = createNonce()
    context.set(CspNonce, nonce, { property: 'cspNonce' })

    const render = context.get(Renderer) as RenderFunction
    const renderWithNonce: RenderFunction = (node, init) =>
      render(<CspNonceProvider nonce={nonce}>{node}</CspNonceProvider>, init)
    // Same key and property as render(), so this replaces the renderer rather
    // than adding a second one; `context.render` now returns this function.
    context.set(Renderer, renderWithNonce, { property: 'render' })

    const response = await next()
    return withHeaders(response, { 'Content-Security-Policy': buildCspDirective(nonce) })
  }

/**
 * Sets headers on a response, copying it first when its headers are immutable
 * (`Response.redirect()` and some fetched responses throw on `set`).
 */
export const withHeaders = (response: Response, headers: Record<string, string>): Response => {
  try {
    for (const [name, value] of Object.entries(headers)) response.headers.set(name, value)
    return response
  } catch {
    const copy = new Response(response.body, response)
    for (const [name, value] of Object.entries(headers)) copy.headers.set(name, value)
    return copy
  }
}
