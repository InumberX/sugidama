// Ported from develop: app/types/api/master-drink-category.d.ts

export type DrinkCategoryItem = {
  id: string
  order: string
  /** In the language asked for (`_lang`). */
  name: string
  /** Names the category's image: public/static/img/img-category-<slug>.webp */
  slug: string
}

export type DrinkCategories = {
  errors: string[]
  messages: string[]
  list: DrinkCategoryItem[]
}
