// Ported from develop: app/server/api/masters.server.ts and the
// `convertMasterDrinkCategory` half of app/utils/tags.ts
import type { Lang } from '../utils/i18n.ts'
import { apiClient, type ApiResult } from './api-client.ts'
import type { DrinkCategories, DrinkCategoryItem } from './drink-categories.types.ts'
import type { Term } from './terms.types.ts'

export type * from './drink-categories.types.ts'

/** The category master in one language; a master without that language answers in Japanese. */
export const getDrinkCategories = (lang: Lang): Promise<ApiResult<DrinkCategories>> =>
  apiClient<DrinkCategories>('/masters/drink_category', { _lang: lang })

/** In the master's own order, without entries that have no usable id or slug. */
export const toDrinkCategoryTerms = (items: DrinkCategoryItem[]): Term[] =>
  [...items]
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((item) => ({
      id: Number.parseInt(item.id, 10),
      label: item.name,
      slug: item.slug,
    }))
    .filter((term) => !Number.isNaN(term.id) && Boolean(term.slug))
