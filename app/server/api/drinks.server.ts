import { apiClient, type ApiResult } from '~/server/api/client.server'
import type { Drinks } from '~/types/api/drinks'
import type { DrinksDetail } from '~/types/api/drinks-detail'

export const getDrinks = async ({
  page = 1,
  pageSize = 12,
  orderQuery = 'inst_ymdhi=DESC',
}: {
  page?: number
  pageSize?: number
  orderQuery?: string
}): Promise<ApiResult<Drinks>> => {
  const params = [`cnt=${pageSize}`, `pageID=${page}`, `order_query=${orderQuery}`].join('&')
  const result = await apiClient<Drinks>({
    path: `/drinks?${params}`,
  })

  return result
}

export const getDrinksDetail = async ({ id }: { id: string | number }): Promise<ApiResult<DrinksDetail>> => {
  const result = await apiClient<DrinksDetail>({
    path: `/drinks/${id}`,
  })

  return result
}
