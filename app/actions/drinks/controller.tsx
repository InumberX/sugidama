import { createController } from 'remix/router'

import { toVisitorStatus } from '../../data/api-client.ts'
import { lang } from '../../middleware/lang.ts'
import { routes } from '../../routes.ts'
import { parseDrinkSearch } from '../../utils/drink-search.ts'
import { HTTP_STATUS } from '../../utils/http-status.ts'
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
      if (search === null) return new Response('Not Found', { status: HTTP_STATUS.NOT_FOUND })

      const data = await loadIndexPage(context.lang, search)
      if (data instanceof Response) return data
      // Past the last page there is nothing to show and no pagination to lead
      // back, so it is a 404 too rather than an empty page a crawler can index.
      // Kuroco itself answers a pageID past the last with a 404 ("pageID is too
      // big.", measured on staging), so the search fails rather than coming back
      // empty; the first page is never past the last (a search with no results
      // answers it with an empty list), so a 404 there stays the API's fault.
      const isPastLastPage = data.result.success
        ? data.search.page > data.result.totalPage
        : data.search.page > 1 && data.result.status === HTTP_STATUS.NOT_FOUND
      if (isPastLastPage) {
        return new Response('Not Found', { status: HTTP_STATUS.NOT_FOUND })
      }
      // A failed search still renders the form, with an error status so the
      // error page is not cached or indexed as the page's content, by the same
      // rule as every other API failure (`toVisitorStatus()`): a search that
      // fails names no missing page, so even its 404 on the first page is a 502.
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
