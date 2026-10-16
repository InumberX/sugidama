// Ported from develop: app/utils/search.ts and the query half of the SG20_100
// loader
//
// The drinks list's query parameters. The home page and the drink cards link
// into the list with them, and the list (SG20_100) reads them back.
import { routes } from '../routes.ts'
import { type Lang, toLangParam } from './i18n.ts'

export const SEARCH_DRINKS_CONDITION_KEY = {
  DRINK: 'drink',
  TASTE: 'taste',
  DRINKABILITY: 'drinkability',
} as const

export type SearchDrinksConditionKey =
  (typeof SEARCH_DRINKS_CONDITION_KEY)[keyof typeof SEARCH_DRINKS_CONDITION_KEY]

/** The drinks list filtered by one condition, e.g. `/drinks?taste=11`. */
export const toDrinkSearchHref = (lang: Lang, key: SearchDrinksConditionKey, id: number): string =>
  routes.drinks.index.href({ lang: toLangParam(lang) }, { searchParams: { [key]: id } })

/** Drinks per page of the list. */
export const DRINKS_PAGE_SIZE = 12

/** How many pages `totalSize` drinks fill; at least one, which may be empty. */
export const countDrinkPages = (totalSize: number): number =>
  Math.max(1, Math.ceil(totalSize / DRINKS_PAGE_SIZE))

/** What the list was asked for: the search form's values and the page. */
export type DrinkSearch = {
  keyword: string
  page: number
} & Record<SearchDrinksConditionKey, number[]>

/** Trims, and turns full-width spaces into ASCII ones, as develop did. */
export const normalizeSearchKeyword = (keyword: string | null): string =>
  (keyword ?? '').trim().replace(/\u3000/g, ' ')

/** Positive integers written as plain digits; anything else (`2abc`, `1.9`, `-5`, `1e3`) is dropped. */
const toIds = (values: string[]): number[] => [
  ...new Set(
    values
      .filter((value) => /^\d+$/.test(value))
      .map(Number)
      .filter((id) => Number.isSafeInteger(id) && id > 0)
  ),
]

/**
 * Reads the list's query. Ids that are not positive integers are dropped and
 * repeats collapse; an id outside the vocabularies is kept, since the
 * vocabularies load alongside the search (the API simply matches nothing for
 * it, and the form shows only the ids it has a checkbox for). A page that is
 * not a positive integer gives `null`, which the page answers with a 404
 * (develop 404'd a non-number and passed 0 or -1 to the API).
 */
export const parseDrinkSearch = (searchParams: URLSearchParams): DrinkSearch | null => {
  const pageParam = searchParams.get('page') ?? '1'
  const page = /^\d+$/.test(pageParam) ? Number(pageParam) : NaN
  if (!Number.isSafeInteger(page) || page < 1) return null

  return {
    keyword: normalizeSearchKeyword(searchParams.get('keyword')),
    page,
    [SEARCH_DRINKS_CONDITION_KEY.DRINK]: toIds(
      searchParams.getAll(SEARCH_DRINKS_CONDITION_KEY.DRINK)
    ),
    [SEARCH_DRINKS_CONDITION_KEY.TASTE]: toIds(
      searchParams.getAll(SEARCH_DRINKS_CONDITION_KEY.TASTE)
    ),
    [SEARCH_DRINKS_CONDITION_KEY.DRINKABILITY]: toIds(
      searchParams.getAll(SEARCH_DRINKS_CONDITION_KEY.DRINKABILITY)
    ),
  }
}

/**
 * The list URL for a search, on the given page: what a pagination link
 * points at. Empty conditions and page 1 are left out, so the first page of
 * an empty search is the bare list URL.
 */
export const toDrinkSearchListHref = (lang: Lang, search: DrinkSearch, page: number): string =>
  routes.drinks.index.href(
    { lang: toLangParam(lang) },
    {
      searchParams: {
        keyword: search.keyword || undefined,
        [SEARCH_DRINKS_CONDITION_KEY.DRINK]: search.drink,
        [SEARCH_DRINKS_CONDITION_KEY.TASTE]: search.taste,
        [SEARCH_DRINKS_CONDITION_KEY.DRINKABILITY]: search.drinkability,
        page: page > 1 ? page : undefined,
      },
    }
  )
