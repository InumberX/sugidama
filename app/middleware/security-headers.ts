// Response hardening that does not depend on the page: ported from the headers
// develop's app/entry.server.tsx set on every document response, its 500
// included. The Content-Security-Policy, which needs the per-request nonce, is
// csp.tsx's.
import type { Middleware } from 'remix/router'

import { IS_PRODUCTION } from '../env.ts'
import { withHeaders } from './with-headers.ts'

/** Sent on every router response. */
export const ALWAYS = {
  'X-Content-Type-Options': 'nosniff',
  // Kept next to CSP `frame-ancestors 'none'` for browsers that predate it.
  'X-Frame-Options': 'DENY',
} as const

/**
 * Production only (both deployed Workers): HSTS on `localhost` would pin the
 * browser to HTTPS for every local port for two years.
 */
export const PRODUCTION_ONLY = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
} as const

export type SecurityHeadersOptions = {
  /** Whether to add `PRODUCTION_ONLY`. Defaults to `IS_PRODUCTION`; tests pass it. */
  production?: boolean
}

/**
 * Adds the static security headers to every response the router produces:
 * rejections from the middleware after it (`cop()`'s 403), and the generic 500
 * for anything that throws — develop sent its 500 with the same headers on
 * purpose, so an error page is never less protected than a normal one. That
 * makes this the router's error boundary; `withErrorResponse` in
 * workers/handler.ts still covers what fails outside the router.
 *
 * Static files from the `ASSETS` binding never reach the router.
 */
export const securityHeaders = ({
  production = IS_PRODUCTION,
}: SecurityHeadersOptions = {}): Middleware => {
  const headers = production ? { ...ALWAYS, ...PRODUCTION_ONLY } : ALWAYS

  return async (_context, next) => {
    let response: Response
    try {
      response = await next()
    } catch (error) {
      console.error(error)
      response = new Response('Internal Server Error', { status: 500 })
    }
    return withHeaders(response, headers)
  }
}
