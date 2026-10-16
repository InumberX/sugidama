import { createController } from 'remix/router'

import { lang } from '../../middleware/lang.ts'
import { routes } from '../../routes.ts'
import { parseDrinkSearch } from '../../utils/drink-search.ts'
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
      return context.render(<IndexPage lang={context.lang} url={context.url} {...data} />)
    },
    show(context) {
      return context.render(
        <ShowPage lang={context.lang} url={context.url} drinkId={context.params.drinkId} />
      )
    },
  },
})
