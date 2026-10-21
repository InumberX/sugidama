// Ported from develop: the loader of app/routes/($lang)._public._layout.drinks._index
//
// The list's data. The vocabularies are needed to draw the search form, so a
// failure there ends the request with its error response, as develop's loader
// threw it; a failed search is shown in place of the results instead, and the
// form stays usable.
//
// The vocabularies load first, as the form needs them anyway; the query's ids
// are then checked against them, and the search runs once with the ids they
// have. An id outside them is left out like a malformed one, so the API is
// never asked for an id it does not know.
import { apiErrorResponse } from '../../../data/api-client.ts'
import { type DrinkTerms, getDrinkTerms, toSearchVocabularies } from '../../../data/drink-terms.ts'
import { getDrinks } from '../../../data/drinks.ts'
import { type DrinkCardProps, toDrinkCardProps } from '../../../utils/drink-card.ts'
import { countDrinkPages, DRINKS_PAGE_SIZE, type DrinkSearch } from '../../../utils/drink-search.ts'
import type { Lang } from '../../../utils/i18n.ts'

export type DrinkSearchResult =
  | { success: true; cards: DrinkCardProps[]; totalPage: number }
  | { success: false; status: number | null }

export type IndexPageData = DrinkTerms & {
  search: DrinkSearch
  result: DrinkSearchResult
}

/** `search` with only the ids the vocabularies have a term for. */
const toKnownSearch = (search: DrinkSearch, terms: DrinkTerms): DrinkSearch => {
  const known = { ...search }
  for (const { name, terms: vocabulary } of toSearchVocabularies(terms)) {
    const termIds = new Set(vocabulary.map((term) => term.id))
    known[name] = search[name].filter((id) => termIds.has(id))
  }
  return known
}

const searchDrinks = (search: DrinkSearch) =>
  getDrinks({
    page: search.page,
    pageSize: DRINKS_PAGE_SIZE,
    keyword: search.keyword || undefined,
    drinkCategoryIds: search.drink,
    tags: [...search.taste, ...search.drinkability],
  })

export const loadIndexPage = async (
  lang: Lang,
  requested: DrinkSearch
): Promise<IndexPageData | Response> => {
  const terms = await getDrinkTerms(lang)
  if (!terms.success) return apiErrorResponse(terms)

  const search = toKnownSearch(requested, terms.data)
  const drinks = await searchDrinks(search)

  const { categories, tagGroups } = terms.data
  const result: DrinkSearchResult = drinks.success
    ? {
        success: true,
        // The page title is the h1 and the results have no heading of their
        // own, so each card's title is an h2 (ArticleCard's default).
        cards: drinks.data.list
          .slice(0, DRINKS_PAGE_SIZE)
          .map((drink) => toDrinkCardProps({ drink, lang, categories, tagGroups })),
        totalPage: countDrinkPages(drinks.data.pageInfo.totalCnt),
      }
    : { success: false, status: drinks.status }

  return { categories, tagGroups, search, result }
}
