import { cop } from 'remix/middleware/cop'
import { createRouter, type MiddlewareContext } from 'remix/router'

import controller from './actions/controller.tsx'
import drinksController from './actions/drinks/controller.tsx'
import { CACHE_BUSTER } from './env.ts'
import { renderWithCsp } from './middleware/csp.tsx'
import { errorPage } from './middleware/error-page.tsx'
import { securityHeaders } from './middleware/security-headers.ts'
import { trailingSlash } from './middleware/trailing-slash.ts'
import { routes } from './routes.ts'
import { setStaticQuery } from './ui/public/static-url.ts'

// - securityHeaders() first, so its headers also land on cop()'s 403 and on the
//   500 it turns a thrown error into.
// - cop() rejects unsafe cross-origin requests (POST/PUT/PATCH/DELETE) from
//   `Sec-Fetch-Site` / `Origin`, without tokens or sessions. When sessions
//   arrive, add session() and then csrf() after it (see CLAUDE.md).
// - trailingSlash() redirects `/en/` to `/en` before matching: route patterns
//   are exact, and develop answered both.
// - renderWithCsp() is render() plus a per-request CSP nonce. No `assets`
//   option: client entries name their own public URLs (`clientModuleUrl()`),
//   and there is no asset server on Workers. Static files never reach this
//   router — the Worker hands GET/HEAD to the `ASSETS` binding first.
// - errorPage() last, inside the renderer: it turns every plain-text error
//   below it into the site's error page, which then gets its CSP on the way
//   out through renderWithCsp().
// Static image URLs carry the same per-deploy query as app.css; Document
// hands it to the browser through `<html data-static-query>`.
setStaticQuery(CACHE_BUSTER)

const securityHeadersMiddleware = securityHeaders()
const copMiddleware = cop()
const trailingSlashMiddleware = trailingSlash()
const renderMiddleware = renderWithCsp()
const errorPageMiddleware = errorPage()

type AppContext = MiddlewareContext<
  [
    typeof securityHeadersMiddleware,
    typeof copMiddleware,
    typeof trailingSlashMiddleware,
    typeof renderMiddleware,
    typeof errorPageMiddleware,
  ]
>

declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}

export const router = createRouter<AppContext>({
  middleware: [
    securityHeadersMiddleware,
    copMiddleware,
    trailingSlashMiddleware,
    renderMiddleware,
    errorPageMiddleware,
  ],
})

router.map(routes, controller)
router.map(routes.drinks, drinksController)
