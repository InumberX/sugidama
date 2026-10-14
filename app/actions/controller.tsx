import { createController } from 'remix/router'

import { IS_PRODUCTION } from '../env.ts'
import { routes } from '../routes.ts'
import { DevUiPage } from './dev-ui-page/dev-ui-page.tsx'
import { HomePage } from './home-page/home-page.tsx'

// Only the direct leaves of the root route map. A nested route map gets its own
// controller and an explicit `router.map` line in app/router.ts.
export default createController(routes, {
  actions: {
    home(context) {
      return context.render(<HomePage url={context.url} />)
    },
    // The gallery is a development tool, so the route exists in every build but
    // only answers outside production. Keeping the 404 here rather than making
    // the route map conditional keeps `typeof routes` stable.
    devUi(context) {
      if (IS_PRODUCTION) return new Response('Not Found', { status: 404 })
      return context.render(<DevUiPage url={context.url} />)
    },
  },
})
