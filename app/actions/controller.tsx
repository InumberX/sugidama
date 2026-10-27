import { createController } from 'remix/router'

import { IS_PRODUCTION } from '../env.ts'
import { lang } from '../middleware/lang.ts'
import { routes } from '../routes.ts'
import { HTTP_STATUS } from '../utils/http-status.ts'
import { DevUiPage } from './dev-ui-page/dev-ui-page.tsx'
import { loadHomePage } from './home-page/home-page.data.ts'
import { HomePage } from './home-page/home-page.tsx'
import { robotsResponse } from './robots.ts'
import { sitemapResponse } from './sitemap.ts'

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
    async home(context) {
      const data = await loadHomePage(context.lang)
      if (data instanceof Response) return data
      return context.render(<HomePage lang={context.lang} url={context.url} {...data} />)
    },
    robots() {
      return robotsResponse()
    },
    sitemap() {
      return sitemapResponse()
    },
    // The gallery is a development tool, so the route exists in every build but
    // only answers outside production. Keeping the 404 here rather than making
    // the route map conditional keeps `typeof routes` stable.
    devUi(context) {
      if (IS_PRODUCTION) return new Response('Not Found', { status: HTTP_STATUS.NOT_FOUND })
      return context.render(<DevUiPage lang={context.lang} url={context.url} />)
    },
  },
})
