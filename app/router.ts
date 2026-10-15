import { cop } from 'remix/middleware/cop'
import { createRouter, type MiddlewareContext } from 'remix/router'

import controller from './actions/controller.tsx'
import { renderWithCsp } from './middleware/csp.tsx'
import { securityHeaders } from './middleware/security-headers.ts'
import { trailingSlash } from './middleware/trailing-slash.ts'
import { routes } from './routes.ts'

// - securityHeaders() first, so its headers also land on cop()'s 403 and on the
//   500 it turns a thrown error into.
// - cop() rejects unsafe cross-origin requests (POST/PUT/PATCH/DELETE) from
//   `Sec-Fetch-Site` / `Origin`, without tokens or sessions. When sessions
//   arrive, add session() and then csrf() after it (see CLAUDE.md).
// - trailingSlash() redirects `/en/` to `/en` before matching: route patterns
//   are exact, and develop answered both.
// - renderWithCsp() is render() plus a per-request CSP nonce. No `assets`
//   option: there is no asset server on Workers, and no page hydrates a client
//   entry yet. Static files never reach this router — the Worker hands GET/HEAD
//   to the `ASSETS` binding first.
const securityHeadersMiddleware = securityHeaders()
const copMiddleware = cop()
const trailingSlashMiddleware = trailingSlash()
const renderMiddleware = renderWithCsp()

type AppContext = MiddlewareContext<
  [
    typeof securityHeadersMiddleware,
    typeof copMiddleware,
    typeof trailingSlashMiddleware,
    typeof renderMiddleware,
  ]
>

declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}

export const router = createRouter<AppContext>({
  middleware: [securityHeadersMiddleware, copMiddleware, trailingSlashMiddleware, renderMiddleware],
})

router.map(routes, controller)
