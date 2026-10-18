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

/**
 * A positive integer written the one way links write it: no sign, no leading
 * zero, nothing after it. Anything else in the query (`page=01`, `drink=02`,
 * `taste=2abc`) is no URL this site links to, and is a 404 rather than a
 * second URL for some other search: dropping a bad id would answer 200 with
 * the list unfiltered.
 */
const CANONICAL_INTEGER = /^[1-9]\d*$/

/**
 * Caps on what the query may carry. They are far above anything the form can
 * submit (a few dozen terms, a short keyword) and keep a crafted query from
 * growing the API request past what Kuroco accepts.
 */
const MAX_IDS_PER_CONDITION = 50
const MAX_KEYWORD_LENGTH = 100

/** Distinct ids, or `null` when any value is not a canonical id or there are too many. */
const toIds = (values: string[]): number[] | null => {
  if (values.length > MAX_IDS_PER_CONDITION) return null
  if (!values.every((value) => CANONICAL_INTEGER.test(value))) return null
  const ids = values.map(Number)
  return ids.every(Number.isSafeInteger) ? [...new Set(ids)] : null
}

/**
 * Reads the list's query, or `null` for one that no link of this site writes,
 * which the page answers with a 404: a page or id that is not a canonical
 * positive integer (develop 404'd a non-number page but passed 0 or -1 to the
 * API), too many ids, or too long a keyword. Repeated ids collapse. An id
 * outside the vocabularies is kept, since the vocabularies load alongside the
 * search (the API simply matches nothing for it, and the form shows only the
 * ids it has a checkbox for).
 */
export const parseDrinkSearch = (searchParams: URLSearchParams): DrinkSearch | null => {
  const pageParam = searchParams.get('page') ?? '1'
  if (!CANONICAL_INTEGER.test(pageParam)) return null
  const page = Number(pageParam)
  if (!Number.isSafeInteger(page)) return null

  const keyword = normalizeSearchKeyword(searchParams.get('keyword'))
  if (keyword.length > MAX_KEYWORD_LENGTH) return null

  const drink = toIds(searchParams.getAll(SEARCH_DRINKS_CONDITION_KEY.DRINK))
  const taste = toIds(searchParams.getAll(SEARCH_DRINKS_CONDITION_KEY.TASTE))
  const drinkability = toIds(searchParams.getAll(SEARCH_DRINKS_CONDITION_KEY.DRINKABILITY))
  if (drink === null || taste === null || drinkability === null) return null

  return {
    keyword,
    page,
    [SEARCH_DRINKS_CONDITION_KEY.DRINK]: drink,
    [SEARCH_DRINKS_CONDITION_KEY.TASTE]: taste,
    [SEARCH_DRINKS_CONDITION_KEY.DRINKABILITY]: drinkability,
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
