import { apiClient, type ApiResult } from '~/server/api/client.server'

import type { MasterDrinkCategory } from '~/types/api/master-drink-category'

export const getMasterDrinkCategory = async (): Promise<ApiResult<MasterDrinkCategory>> => {
  const result = await apiClient<MasterDrinkCategory>({
    path: '/masters/drink_category',
  })

  return result
}
