type MasterDrinkCategoryItem = {
  id: string
  name: string
  name_en: string
  slug: string
}

export type MasterDrinkCategory = {
  errors: string[]
  messages: string[]
  list: MasterDrinkCategoryItem[]
}
