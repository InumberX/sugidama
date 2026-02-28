import { apiClient, type ApiResult } from '~/server/api/client.server'
import type { DrinksDetail } from '~/types/api/drinks-detail'

export const getDrinksDetail = async ({ id }: { id: string | number }): Promise<ApiResult<DrinksDetail>> => {
  const result = await apiClient<DrinksDetail>({
    path: `/drinks/${id}`,
  })

  if (!result.success) {
    return result
  }

  return result
}
