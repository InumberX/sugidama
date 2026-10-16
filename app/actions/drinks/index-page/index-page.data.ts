// Ported from develop: the loader of app/routes/($lang)._public._layout.drinks._index
//
// The list's data. The vocabularies are needed to draw the search form, so a
// failure there ends the request with its error response, as develop's loader
// threw it; a failed search is shown in place of the results instead, and the
// form stays usable.
import { apiErrorResponse } from '../../../data/api-client.ts'
import { type DrinkTerms, getDrinkTerms } from '../../../data/drink-terms.ts'
import { getDrinks } from '../../../data/drinks.ts'
import { type DrinkCardProps, toDrinkCardProps } from '../../../utils/drink-card.ts'
import { countDrinkPages, DRINKS_PAGE_SIZE, type DrinkSearch } from '../../../utils/drink-search.ts'
import type { Lang } from '../../../utils/i18n.ts'

export type DrinkSearchResult =
  | { success: true; cards: DrinkCardProps[]; totalPage: number }
  | { success: false; status: number | null; message: string }

export type IndexPageData = DrinkTerms & {
  search: DrinkSearch
  result: DrinkSearchResult
}

export const loadIndexPage = async (
  lang: Lang,
  search: DrinkSearch
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
