// The vocabularies a drink card needs to name its category and tags: the
// category master and both tag groups, in one language. The home page and the
// drinks list load the same three, as develop's loaders did.
import type { TagGroup } from '../utils/drink-card.ts'
import { SEARCH_DRINKS_CONDITION_KEY } from '../utils/drink-search.ts'
import type { Lang } from '../utils/i18n.ts'
import type { ApiResult } from './api-client.ts'
import { getDrinkCategories, toDrinkCategoryTerms } from './drink-categories.ts'
import { getDrinkabilityTags, getTasteTags, toTagTerms } from './tags.ts'
import type { Term } from './terms.types.ts'

export type DrinkTerms = {
  categories: Term[]
  /** Taste, then drinkability: the order a card lists its tags in. */
  tagGroups: TagGroup[]
}

/** Loads the three in parallel; the first failure, if any, is the result. */
export const getDrinkTerms = async (lang: Lang): Promise<ApiResult<DrinkTerms>> => {
  const [categories, taste, drinkability] = await Promise.all([
    getDrinkCategories(),
    getTasteTags(),
    getDrinkabilityTags(),
  ])

  if (!categories.success) return categories
  if (!taste.success) return taste
  if (!drinkability.success) return drinkability

  return {
    success: true,
    data: {
      categories: toDrinkCategoryTerms(categories.data.list, lang),
      tagGroups: [
        { name: SEARCH_DRINKS_CONDITION_KEY.TASTE, terms: toTagTerms(taste.data.list, lang) },
        {
          name: SEARCH_DRINKS_CONDITION_KEY.DRINKABILITY,
          terms: toTagTerms(drinkability.data.list, lang),
        },
      ],
    },
  }
}
