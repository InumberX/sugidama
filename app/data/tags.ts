// Ported from develop: app/server/api/tags.server.ts and the `convertTags`
// half of app/utils/tags.ts
import type { Lang } from '../utils/i18n.ts'
import { apiClient, type ApiResult } from './api-client.ts'
import type { TagCategory, Tags } from './tags.types.ts'
import type { Term } from './terms.types.ts'

export type * from './tags.types.ts'

/** A tag group in one language; a tag without that language is left out. */
export const getTasteTags = (lang: Lang): Promise<ApiResult<Tags>> =>
  apiClient<Tags>('/tags/taste', { _lang: lang })

export const getDrinkabilityTags = (lang: Lang): Promise<ApiResult<Tags>> =>
  apiClient<Tags>('/tags/drinkability', { _lang: lang })

/**
 * Every tag of every category, named by its label, else its title. A label of
 * only spaces counts as none, and so does a missing one (`null`).
 */
export const toTagTerms = (categories: TagCategory[]): Term[] =>
  categories.flatMap((category) =>
    Object.values(category.tags ?? {}).map((tag) => ({
      id: tag.tag_id,
      label: tag.ext_col_01?.trim() || tag.tag_nm,
    }))
  )
