import { apiClient, type ApiResult } from '~/server/api/client.server'
import type { Drinks } from '~/types/api/drinks'
import type { DrinksDetail } from '~/types/api/drinks-detail'

export const getDrinks = async ({
  page = 1,
  pageSize = 12,
  orderQuery = 'inst_ymdhi=DESC',
  keyword,
  tags,
  drinkCategoryIds,
}: {
  page?: number
  pageSize?: number
  orderQuery?: string
  keyword?: string
  tags?: number[]
  drinkCategoryIds?: number[]
}): Promise<ApiResult<Drinks>> => {
  const filter: string[] = []
  const searchParams = new URLSearchParams()
  searchParams.set('cnt', String(pageSize))
  searchParams.set('pageID', String(page))
  searchParams.set('order_query', orderQuery)

  if (keyword) {
    const sanitizedKeyword = keyword.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    filter.push(`keyword contains "${sanitizedKeyword}"`)
  }

  if (drinkCategoryIds && drinkCategoryIds.length > 0) {
    const drinkCategoryFilter = drinkCategoryIds.map((id) => `drink_category = "${id}"`).join(' OR ')
    filter.push(drinkCategoryIds.length > 1 ? `(${drinkCategoryFilter})` : drinkCategoryFilter)
  }

  if (tags && tags.length > 0) {
    tags.forEach((tag) => {
      searchParams.append('tag_id', String(tag))
    })
  }

  if (filter.length > 0) {
    searchParams.set('filter', filter.join(' AND '))
  }

  const result = await apiClient<Drinks>({
    path: `/drinks?${searchParams.toString()}`,
  })

  return result
}

export const getDrinksDetail = async ({ id }: { id: string | number }): Promise<ApiResult<DrinksDetail>> => {
  const result = await apiClient<DrinksDetail>({
    path: `/drinks/${id}`,
  })

  return result
}
