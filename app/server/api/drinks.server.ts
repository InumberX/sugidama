import { apiClient } from '~/server/api/client.server'
import type { DrinksDetail } from '~/types/api/drinks-detail'

export type ResponseGetDrinksDetail = DrinksDetail['details'] | undefined

export const getDrinksDetail = async ({ id }: { id: string }): Promise<ResponseGetDrinksDetail> => {
  const result = await apiClient<DrinksDetail>({
    path: `/drinks/${id}`,
    options: {
      method: 'GET',
    },
  })

  if (!result.success) {
    return undefined
  }

  return result.data.details
}
