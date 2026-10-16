// Ported from develop: app/server/api/masters.server.ts and the
// `convertMasterDrinkCategory` half of app/utils/tags.ts
import type { Lang } from '../utils/i18n.ts'
import { apiClient, type ApiResult } from './api-client.ts'
import type { DrinkCategories, DrinkCategoryItem } from './drink-categories.types.ts'
import type { Term } from './terms.types.ts'

export type * from './drink-categories.types.ts'

export const getDrinkCategories = (): Promise<ApiResult<DrinkCategories>> =>
  apiClient<DrinkCategories>('/masters/drink_category')

/** In the master's own order, in one language, without entries that have no usable id or slug. */
export const toDrinkCategoryTerms = (items: DrinkCategoryItem[], lang: Lang): Term[] =>
  [...items]
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((item) => ({
      id: Number.parseInt(item.id, 10),
      label: lang === 'en' ? item.name_en : item.name,
      slug: item.slug,
    }))
    .filter((term) => !Number.isNaN(term.id) && Boolean(term.slug))
