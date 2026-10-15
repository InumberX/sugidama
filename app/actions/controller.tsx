import { createController } from 'remix/router'

import { IS_PRODUCTION } from '../env.ts'
import { lang } from '../middleware/lang.ts'
import { routes } from '../routes.ts'
import { DevUiPage } from './dev-ui-page/dev-ui-page.tsx'
import { HomePage } from './home-page/home-page.tsx'

// Only the direct leaves of the root route map. A nested route map gets its own
// controller and an explicit `router.map` line in app/router.ts.
export default createController(routes, {
  // Controller rather than action middleware: a controller's `actions` object
  // cannot carry the context an action's own middleware adds, so `context.lang`
  // would not be typed. `devUi` has no `lang` param and so always resolves to
  // the default language. Each nested route area's controller adds it again —
  // controller middleware does not reach other controllers.
  middleware: [lang()],
  actions: {
    home(context) {
      return context.render(<HomePage lang={context.lang} url={context.url} />)
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
