import { createController } from 'remix/router'

import { lang } from '../../middleware/lang.ts'
import { routes } from '../../routes.ts'
import { DRINKS_PAGE_SIZE, parseDrinkSearch } from '../../utils/drink-search.ts'
import { loadIndexPage } from './index-page/index-page.data.ts'
import { IndexPage } from './index-page/index-page.tsx'
import { ShowPage } from './show-page/show-page.tsx'

// The drinks route area. Controller middleware does not reach other
// controllers, so lang() is added again here.
export default createController(routes.drinks, {
  middleware: [lang()],
  actions: {
    async index(context) {
      const search = parseDrinkSearch(context.url.searchParams)
      // A page that is not a positive integer names no page of results.
      if (search === null) return new Response('Not Found', { status: 404 })

      const data = await loadIndexPage(context.lang, search)
      if (data instanceof Response) return data
      // Past the last page there is nothing to show and no pagination to lead
      // back, so it is a 404 too rather than an empty page a crawler can index.
      if (
        data.result.success &&
        search.page > 1 &&
        search.page > Math.ceil(data.result.totalSize / DRINKS_PAGE_SIZE)
      ) {
        return new Response('Not Found', { status: 404 })
      }
      return context.render(<IndexPage lang={context.lang} url={context.url} {...data} />)
    },
    show(context) {
      return context.render(
        <ShowPage lang={context.lang} url={context.url} drinkId={context.params.drinkId} />
      )
    },
  },
})
