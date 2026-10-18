import { createController } from 'remix/router'

import { lang } from '../../middleware/lang.ts'
import { routes } from '../../routes.ts'
import { parseDrinkSearch } from '../../utils/drink-search.ts'
import { loadIndexPage } from './index-page/index-page.data.ts'
import { IndexPage } from './index-page/index-page.tsx'
import { ShowPage } from './show-page/show-page.tsx'

// The drinks route area. Controller middleware does not reach other
// controllers, so lang() is added again here.
const searchFailureStatus = (status: number | null): number =>
  status === null ? 500 : status >= 500 ? status : 502

export default createController(routes.drinks, {
  middleware: [lang()],
  actions: {
    async index(context) {
      const parsed = parseDrinkSearch(context.url.searchParams)
      // A page that is not a positive integer, or a keyword longer than any
      // form submits, names no page of results.
      if (parsed === null) return new Response('Not Found', { status: 404 })

      const data = await loadIndexPage(context.lang, context.url, parsed)
      if (data instanceof Response) return data
      // Past the last page there is nothing to show and no pagination to lead
      // back, so it is a 404 too rather than an empty page a crawler can index.
      if (data.result.success && data.search.page > data.result.totalPage) {
        return new Response('Not Found', { status: 404 })
      }
      // A failed search still renders the form, with an error status so the
      // error page is not cached or indexed as the page's content. The API's
      // 5xx passes through; its 4xx (a key it rejects, a filter it refuses) is
      // not the visitor's fault and becomes a 502; nothing answered is a 500.
      const init = data.result.success
        ? undefined
        : { status: searchFailureStatus(data.result.status) }
      return context.render(<IndexPage lang={context.lang} url={context.url} {...data} />, init)
    },
    show(context) {
      return context.render(
        <ShowPage lang={context.lang} url={context.url} drinkId={context.params.drinkId} />
      )
    },
  },
})
