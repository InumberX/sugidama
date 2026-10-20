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
 * zero, nothing after it. A page written any other way (`page=01`, `page=0`)
 * names no page of results and is a 404; an id written any other way
 * (`drink=02`, `taste=2abc`) is ignored, as develop dropped what was not a
 * number.
 */
const CANONICAL_INTEGER = /^[1-9]\d*$/

/**
 * The longest keyword the list accepts. It is far above anything a visitor
 * types, the form's field stops there (`maxlength`), and it keeps a crafted
 * query from growing the API request past what Kuroco accepts. A longer one is
 * a 404, since cutting it would search for something else. Ids need no cap:
 * the list keeps only those the vocabularies have (`index-page.data.ts`), so
 * no more reach the API than there are terms.
 */
export const MAX_KEYWORD_LENGTH = 100

/** The canonical ids among `values`, each once. */
const toIds = (values: string[]): number[] => [
  ...new Set(
    values
      .filter((value) => CANONICAL_INTEGER.test(value))
      .map(Number)
      .filter(Number.isSafeInteger)
  ),
]

/**
 * Reads the list's query, or `null` for one that names no page of results,
 * which the page answers with a 404: a page that is not a canonical positive
 * integer (develop 404'd a non-number page but passed 0 or -1 to the API), or
 * too long a keyword. Ids are forgiving instead: a malformed or repeated one
 * is left out of the search (see `toIds`), and so is one outside the
 * vocabularies, which `index-page.data.ts` drops once they have loaded.
 */
export const parseDrinkSearch = (searchParams: URLSearchParams): DrinkSearch | null => {
  const pageParam = searchParams.get('page') ?? '1'
  if (!CANONICAL_INTEGER.test(pageParam)) return null
  const page = Number(pageParam)
  if (!Number.isSafeInteger(page)) return null

  const keyword = normalizeSearchKeyword(searchParams.get('keyword'))
  if (keyword.length > MAX_KEYWORD_LENGTH) return null

  const ids = Object.fromEntries(
    Object.values(SEARCH_DRINKS_CONDITION_KEY).map((key) => [key, toIds(searchParams.getAll(key))])
  ) as Record<SearchDrinksConditionKey, number[]>

  return { keyword, page, ...ids }
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
