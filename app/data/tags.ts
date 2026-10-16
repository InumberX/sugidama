// Ported from develop: app/server/api/tags.server.ts and the `convertTags`
// half of app/utils/tags.ts
import type { Lang } from '../utils/i18n.ts'
import { apiClient, type ApiResult } from './api-client.ts'
import type { TagCategory, Tags } from './tags.types.ts'
import type { Term } from './terms.types.ts'

export type * from './tags.types.ts'

export const getTasteTags = (): Promise<ApiResult<Tags>> => apiClient<Tags>('/tags/taste')

export const getDrinkabilityTags = (): Promise<ApiResult<Tags>> =>
  apiClient<Tags>('/tags/drinkability')

/** Every tag of every category, in one language. */
export const toTagTerms = (categories: TagCategory[], lang: Lang): Term[] =>
  categories.flatMap((category) =>
    Object.values(category.tags).map((tag) => ({
      id: tag.tag_id,
      label: lang === 'en' ? tag.ext_col_01 : tag.tag_nm,
    }))
  )
