// Ported from develop: app/server/api/drinks.server.ts
import { HTTP_STATUS } from '../utils/http-status.ts'
import type { Lang } from '../utils/i18n.ts'
import { apiClient, type ApiResult } from './api-client.ts'
import type { Drink, DrinkDetail, Drinks } from './drinks.types.ts'

export type * from './drinks.types.ts'

export type GetDrinksOptions = {
  /** The language the drinks are read and searched in; a drink without that language is left out. */
  lang: Lang
  page?: number
  pageSize?: number
  orderQuery?: string
  keyword?: string
  tags?: number[]
  drinkCategoryIds?: number[]
}

/**
 * The fields a keyword is looked for in, ORed. Kuroco's `keyword` would be
 * shorter, but it searches the Japanese side whatever `filter_lang` says, and
 * answers a 500 when `filter_lang` is `en`; a named field searches the side
 * `filter_lang` names. Each must be in the endpoint's
 * `filter_request_allow_list`.
 */
const KEYWORD_FIELDS = ['subject', 'contents', 'manufacturer', 'comment'] as const

/** The drink list, newest first by default; every condition narrows it further. */
export const getDrinks = ({
  lang,
  page = 1,
  pageSize = 12,
  orderQuery = 'inst_ymdhi=DESC',
  keyword,
  tags,
  drinkCategoryIds,
}: GetDrinksOptions): Promise<ApiResult<Drinks>> => {
  const filter: string[] = []

  if (keyword) {
    // Kuroco's filter syntax quotes strings with `"`; escape it and `\`.
    const escaped = keyword.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    filter.push(`(${KEYWORD_FIELDS.map((field) => `${field} contains "${escaped}"`).join(' OR ')})`)
  }

  if (drinkCategoryIds && drinkCategoryIds.length > 0) {
    const categories = drinkCategoryIds.map((id) => `drink_category = "${id}"`).join(' OR ')
    filter.push(drinkCategoryIds.length > 1 ? `(${categories})` : categories)
  }

  return apiClient<Drinks>('/drinks', {
    _lang: lang,
    cnt: pageSize,
    pageID: page,
    order_query: orderQuery,
    tag_id: tags,
    filter: filter.length > 0 ? filter.join(' AND ') : undefined,
    // Which language's fields the filter reads; Kuroco's default is the
    // primary language, Japanese.
    filter_lang: filter.length > 0 ? lang : undefined,
  })
}

/** Whether an id can name a drink's page: a dot segment would climb out of `/drinks/`. */
const isDrinkId = (id: string): boolean => id !== '' && id !== '.' && id !== '..'

/**
 * One drink in one language, by its slug or its topics_id — whichever the
 * route carried; a drink without that language is a 404. The id comes from
 * the URL, so it is encoded: a `/` or `?` in it must not reach another
 * endpoint or add a query. A dot segment survives encoding (`fetch` resolves
 * `..` and `%2E%2E` alike) and would climb out of `/drinks/`, so it names no
 * drink and is answered as a 404 without asking the API.
 */
export const getDrinkDetail = async (id: string, lang: Lang): Promise<ApiResult<DrinkDetail>> => {
  if (!isDrinkId(id)) {
    return { success: false, status: HTTP_STATUS.NOT_FOUND, message: 'Not Found' }
  }
  const result = await apiClient<{ details?: unknown }>(`/drinks/${encodeURIComponent(id)}`, {
    _lang: lang,
  })
  if (!result.success) return result
  // An answer without a drink names none, whatever its status said: no
  // details at all, or an empty object or array where the drink should be.
  if (!isDrink(result.data.details)) {
    return { success: false, status: HTTP_STATUS.NOT_FOUND, message: 'Not Found' }
  }
  return result as ApiResult<DrinkDetail>
}

/** Enough of a drink to render: every drink has a numeric topics_id. */
const isDrink = (value: unknown): value is Drink =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { topics_id?: unknown }).topics_id === 'number'
