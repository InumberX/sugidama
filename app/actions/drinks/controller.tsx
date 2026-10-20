import { createController } from 'remix/router'

import { toVisitorStatus } from '../../data/api-client.ts'
import { lang } from '../../middleware/lang.ts'
import { routes } from '../../routes.ts'
import { parseDrinkSearch } from '../../utils/drink-search.ts'
import { loadIndexPage } from './index-page/index-page.data.ts'
import { IndexPage } from './index-page/index-page.tsx'
import { loadShowPage } from './show-page/show-page.data.ts'
import { ShowPage } from './show-page/show-page.tsx'

// The drinks route area. Controller middleware does not reach other
// controllers, so lang() is added again here.
export default createController(routes.drinks, {
  middleware: [lang()],
  actions: {
    async index(context) {
      const search = parseDrinkSearch(context.url.searchParams)
      // A page that is not a positive integer, or a keyword longer than any
      // form submits, names no page of results.
      if (search === null) return new Response('Not Found', { status: 404 })

      const data = await loadIndexPage(context.lang, search)
      if (data instanceof Response) return data
      // Past the last page there is nothing to show and no pagination to lead
      // back, so it is a 404 too rather than an empty page a crawler can index.
      if (data.result.success && data.search.page > data.result.totalPage) {
        return new Response('Not Found', { status: 404 })
      }
      // A failed search still renders the form, with an error status so the
      // error page is not cached or indexed as the page's content, by the same
      // rule as every other API failure (`toVisitorStatus()`): a search that
      // fails names no missing page, so even its 404 is a 502.
      const init = data.result.success ? undefined : { status: toVisitorStatus(data.result) }
      return context.render(<IndexPage lang={context.lang} url={context.url} {...data} />, init)
    },
    async show(context) {
      const data = await loadShowPage(context.lang, context.params.drinkId)
      if (data instanceof Response) return data
      return context.render(<ShowPage lang={context.lang} url={context.url} {...data} />)
    },
  },
})
