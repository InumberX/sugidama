import { apiClient, type ApiResult } from '~/server/api/client.server'

import type { Drinks } from '~/types/api/drinks'
import type { DrinksDetail } from '~/types/api/drinks-detail'

export const getDrinks = async ({
  page = 1,
  pageSize = 12,
  orderQuery = 'inst_ymdhi=DESC',
  keyword,
  tags,
}: {
  page?: number
  pageSize?: number
  orderQuery?: string
  keyword?: string
  tags?: number[]
}): Promise<ApiResult<Drinks>> => {
  const searchParams = new URLSearchParams()
  searchParams.set('cnt', String(pageSize))
  searchParams.set('pageID', String(page))
  searchParams.set('order_query', orderQuery)

  if (keyword) {
    searchParams.set('topics_keyword', keyword)
  }

  if (tags && tags.length > 0) {
    tags.forEach((tag) => {
      searchParams.append('tag_id', String(tag))
    })
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
