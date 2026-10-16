// Ported from develop: the loader of app/routes/($lang)._public._layout._index
//
// The home page's data, fetched in parallel. A failed call ends the request
// with that call's error response, as develop's loader threw it.
import { apiErrorResponse } from '../../data/api-client.ts'
import { getDrinkTerms } from '../../data/drink-terms.ts'
import { getDrinks } from '../../data/drinks.ts'
import type { Term } from '../../data/terms.types.ts'
import { type DrinkCardProps, toDrinkCardProps } from '../../utils/drink-card.ts'
import type { Lang } from '../../utils/i18n.ts'

/** The newest drinks: two large cards, then up to four compact ones. */
export const NEW_ARRIVALS_COUNT = { cards: 2, compactCards: 4 } as const
const NEW_ARRIVALS_TOTAL = NEW_ARRIVALS_COUNT.cards + NEW_ARRIVALS_COUNT.compactCards

export type HomePageData = {
  cards: DrinkCardProps[]
  compactCards: DrinkCardProps[]
  categories: Term[]
}

export const loadHomePage = async (lang: Lang): Promise<HomePageData | Response> => {
  const [terms, drinksResult] = await Promise.all([
    getDrinkTerms(lang),
    getDrinks({ page: 1, pageSize: NEW_ARRIVALS_TOTAL }),
  ])

  if (!terms.success) return apiErrorResponse(terms)
  if (!drinksResult.success) return apiErrorResponse(drinksResult)

  const { categories, tagGroups } = terms.data
  // The section title is the page's h2, so each card's title is an h3.
  // Capped here too, so a response longer than `cnt` cannot grow the page.
  const cards = drinksResult.data.list
    .slice(0, NEW_ARRIVALS_TOTAL)
    .map((drink) => toDrinkCardProps({ drink, lang, categories, tagGroups, titleTag: 'h3' }))

  return {
    cards: cards.slice(0, NEW_ARRIVALS_COUNT.cards),
    compactCards: cards.slice(NEW_ARRIVALS_COUNT.cards),
    categories,
  }
}
