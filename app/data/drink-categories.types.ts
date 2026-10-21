// Ported from develop: app/types/api/master-drink-category.d.ts

export type DrinkCategoryItem = {
  id: string
  order: string
  name: string
  name_en: string
  /** Names the category's image: public/assets/img/img-category-<slug>.webp */
  slug: string
}

export type DrinkCategories = {
  errors: string[]
  messages: string[]
  list: DrinkCategoryItem[]
}
