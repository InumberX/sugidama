// Ported from develop: the loader of app/routes/($lang)._public._layout._index
//
// The home page's data, fetched in parallel. A failed call ends the request
// with that call's error response, as develop's loader threw it.
import { apiErrorResponse } from '../../data/api-client.ts'
import { getDrinkCategories, type Term, toDrinkCategoryTerms } from '../../data/drink-categories.ts'
import { getDrinks } from '../../data/drinks.ts'
import { getDrinkabilityTags, getTasteTags, toTagTerms } from '../../data/tags.ts'
import { type DrinkCardProps, toDrinkCardProps } from '../../utils/drink-card.ts'
import { SEARCH_DRINKS_CONDITION_KEY } from '../../utils/drink-search.ts'
import type { Lang } from '../../utils/i18n.ts'

/** The newest drinks: two large cards, then up to four compact ones. */
export const NEW_ARRIVALS_COUNT = { cards: 2, compactCards: 4 } as const

export type HomePageData = {
  cards: DrinkCardProps[]
  compactCards: DrinkCardProps[]
  categories: Term[]
}

export const loadHomePage = async (lang: Lang): Promise<HomePageData | Response> => {
  const [categoriesResult, tasteResult, drinkabilityResult, drinksResult] = await Promise.all([
    getDrinkCategories(),
    getTasteTags(),
    getDrinkabilityTags(),
    getDrinks({ page: 1, pageSize: NEW_ARRIVALS_COUNT.cards + NEW_ARRIVALS_COUNT.compactCards }),
  ])

  if (!categoriesResult.success) return apiErrorResponse(categoriesResult)
  if (!tasteResult.success) return apiErrorResponse(tasteResult)
  if (!drinkabilityResult.success) return apiErrorResponse(drinkabilityResult)
  if (!drinksResult.success) return apiErrorResponse(drinksResult)

  const categories = toDrinkCategoryTerms(categoriesResult.data.list, lang)
  const tagGroups = [
    { name: SEARCH_DRINKS_CONDITION_KEY.TASTE, terms: toTagTerms(tasteResult.data.list, lang) },
    {
      name: SEARCH_DRINKS_CONDITION_KEY.DRINKABILITY,
      terms: toTagTerms(drinkabilityResult.data.list, lang),
    },
  ]
  // The section title is the page's h2, so each card's title is an h3.
  const cards = drinksResult.data.list.map((drink) => {
    const card = toDrinkCardProps({ drink, lang, categories, tagGroups })
    return { ...card, title: { ...card.title, titleTag: 'h3' as const } }
  })

  return {
    cards: cards.slice(0, NEW_ARRIVALS_COUNT.cards),
    compactCards: cards.slice(NEW_ARRIVALS_COUNT.cards),
    categories,
  }
}
