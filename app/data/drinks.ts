// Ported from develop: app/server/api/drinks.server.ts (the list query; the
// detail query joins with the SG20_101 port)
import { apiClient, type ApiResult } from './api-client.ts'
import type { Drinks } from './drinks.types.ts'

export type * from './drinks.types.ts'

export type GetDrinksOptions = {
  page?: number
  pageSize?: number
  orderQuery?: string
  keyword?: string
  tags?: number[]
  drinkCategoryIds?: number[]
}

/** The drink list, newest first by default; every condition narrows it further. */
export const getDrinks = ({
  page = 1,
  pageSize = 12,
  orderQuery = 'inst_ymdhi=DESC',
  keyword,
  tags,
  drinkCategoryIds,
}: GetDrinksOptions = {}): Promise<ApiResult<Drinks>> => {
  const filter: string[] = []
  const searchParams = new URLSearchParams({
    cnt: String(pageSize),
    pageID: String(page),
    order_query: orderQuery,
  })

  if (keyword) {
    // Kuroco's filter syntax quotes strings with `"`; escape it and `\`.
    const escaped = keyword.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    filter.push(`keyword contains "${escaped}"`)
  }

  if (drinkCategoryIds && drinkCategoryIds.length > 0) {
    const categories = drinkCategoryIds.map((id) => `drink_category = "${id}"`).join(' OR ')
    filter.push(drinkCategoryIds.length > 1 ? `(${categories})` : categories)
  }

  for (const tag of tags ?? []) searchParams.append('tag_id', String(tag))

  if (filter.length > 0) searchParams.set('filter', filter.join(' AND '))

  return apiClient<Drinks>(`/drinks?${searchParams.toString()}`)
}
