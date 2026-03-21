import { apiClient, type ApiResult } from '~/server/api/client.server'

import type { Tag } from '~/types/api/tags'

export const getTagTaste = async (): Promise<ApiResult<Tag>> => {
  const result = await apiClient<Tag>({
    path: `/tags/taste`,
  })

  return result
}
