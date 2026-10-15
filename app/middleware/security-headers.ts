// Response hardening that does not depend on the page: ported from the headers
// develop's app/entry.server.tsx set on every document response. The
// Content-Security-Policy, which needs the per-request nonce, is csp.tsx's.
import type { Middleware } from 'remix/router'

import { IS_PRODUCTION } from '../env.ts'
import { withHeaders } from './csp.tsx'

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

/**
 * Adds the static security headers to every response the router produces,
 * including the rejections of middleware placed after it (`cop()`'s 403).
 * Static files from the `ASSETS` binding never reach the router.
 */
export const securityHeaders = (): Middleware => async (_context, next) =>
  withHeaders(await next(), IS_PRODUCTION ? { ...ALWAYS, ...PRODUCTION_ONLY } : ALWAYS)
