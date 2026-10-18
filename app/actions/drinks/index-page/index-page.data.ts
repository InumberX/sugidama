// Ported from develop: the loader of app/routes/($lang)._public._layout.drinks._index
//
// The list's data. The vocabularies are needed to draw the search form, so a
// failure there ends the request with its error response, as develop's loader
// threw it; a failed search is shown in place of the results instead, and the
// form stays usable.
//
// An id outside the vocabularies is ignored like a malformed one. The search
// and the vocabularies load together, so a query that carries either is
// redirected, once, to the same search without them rather than answered
// under a second URL (and an unknown id would have matched nothing). The
// redirect is a 302 because a term added later makes the id valid.
import { apiErrorResponse } from '../../../data/api-client.ts'
import { type DrinkTerms, getDrinkTerms } from '../../../data/drink-terms.ts'
import { getDrinks } from '../../../data/drinks.ts'
import { localRedirect } from '../../../middleware/local-redirect.ts'
import { type DrinkCardProps, toDrinkCardProps } from '../../../utils/drink-card.ts'
import {
  countDrinkPages,
  DRINKS_PAGE_SIZE,
  type DrinkSearch,
  type ParsedDrinkSearch,
  SEARCH_DRINKS_CONDITION_KEY,
  toDrinkSearchRedirectHref,
} from '../../../utils/drink-search.ts'
import type { Lang } from '../../../utils/i18n.ts'

export type DrinkSearchResult =
  | { success: true; cards: DrinkCardProps[]; totalPage: number }
  | { success: false; status: number | null; message: string }

export type IndexPageData = DrinkTerms & {
  search: DrinkSearch
  result: DrinkSearchResult
}

/** `search` with only the ids the vocabularies have a term for. */
const toKnownSearch = (search: DrinkSearch, { categories, tagGroups }: DrinkTerms): DrinkSearch => {
  const known = { ...search }
  for (const { name, terms } of [
    { name: SEARCH_DRINKS_CONDITION_KEY.DRINK, terms: categories },
    ...tagGroups,
  ]) {
    known[name] = search[name].filter((id) => terms.some((term) => term.id === id))
  }
  return known
}

export const loadIndexPage = async (
  lang: Lang,
  url: URL,
  { search, ignored }: ParsedDrinkSearch
): Promise<IndexPageData | Response> => {
  const [terms, drinks] = await Promise.all([
    getDrinkTerms(lang),
    getDrinks({
      page: search.page,
      pageSize: DRINKS_PAGE_SIZE,
      keyword: search.keyword || undefined,
      drinkCategoryIds: search.drink,
      tags: [...search.taste, ...search.drinkability],
    }),
  ])

  if (!terms.success) return apiErrorResponse(terms)

  const known = toKnownSearch(search, terms.data)
  const unknown = Object.values(SEARCH_DRINKS_CONDITION_KEY).some(
    (key) => known[key].length !== search[key].length
  )
  if (ignored || unknown) {
    return localRedirect(url, toDrinkSearchRedirectHref(lang, known, url.searchParams))
  }

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
    : { success: false, status: drinks.status, message: drinks.message }

  return { categories, tagGroups, search, result }
}
