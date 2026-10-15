import { cop } from 'remix/middleware/cop'
import { render } from 'remix/middleware/render'
import { createRouter, type MiddlewareContext } from 'remix/router'

import controller from './actions/controller.tsx'
import { csp } from './middleware/csp.tsx'
import { securityHeaders } from './middleware/security-headers.ts'
import { routes } from './routes.ts'

// Order matters:
// - securityHeaders() first, so its headers also land on responses produced by
//   the middleware after it, cop()'s 403 included.
// - cop() rejects unsafe cross-origin requests (POST/PUT/PATCH/DELETE) from
//   `Sec-Fetch-Site` / `Origin`, without tokens or sessions. When sessions
//   arrive, add session() and then csrf() after it (see CLAUDE.md).
// - render() has no `assets` option: there is no asset server on Workers, and
//   no page hydrates a client entry yet. Static files never reach this router —
//   the Worker hands GET/HEAD to the `ASSETS` binding first.
// - csp() after render(), because it wraps the renderer render() installs.
const securityHeadersMiddleware = securityHeaders()
const copMiddleware = cop()
const renderMiddleware = render()
const cspMiddleware = csp()

type AppContext = MiddlewareContext<
  [
    typeof securityHeadersMiddleware,
    typeof copMiddleware,
    typeof renderMiddleware,
    typeof cspMiddleware,
  ]
>

declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}

export const router = createRouter<AppContext>({
  middleware: [securityHeadersMiddleware, copMiddleware, renderMiddleware, cspMiddleware],
})

router.map(routes, controller)
