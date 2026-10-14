import { render } from 'remix/middleware/render'
import { createRouter, type MiddlewareContext } from 'remix/router'

import controller from './actions/controller.tsx'
import { routes } from './routes.ts'

// No `assets` option: there is no asset server on Workers, and no page hydrates
// a client entry yet. Static files never reach this router — the Worker hands
// GET/HEAD to the `ASSETS` binding first (workers/handler.ts).
const renderMiddleware = render()
type AppContext = MiddlewareContext<[typeof renderMiddleware]>

declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}

export const router = createRouter<AppContext>({
  middleware: [renderMiddleware],
})

router.map(routes, controller)
