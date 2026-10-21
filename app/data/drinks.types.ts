// Ported from develop: app/types/api/drinks.d.ts, trimmed to the fields the
// site reads. Dates arrive as JSON strings, not `Date` (develop typed them as
// `Date`, which they never were at runtime).

export type DrinkCategoryRef = { key: string; label: string }

export type DrinkLink = {
  link_text: string
  link_text_en: string
  link_url: string
  link_url_en: string
}

export type DrinkImage = { id: string; url: string; desc: string; url_org: string }

export type DrinkMainVisual = {
  /** Empty when the row was saved without an image. */
  main_visual_image: DrinkImage | null | ''
  main_visual_title: string
  main_visual_title_en: string
}

export type DrinkTag = { tag_id: number; tag_nm: string }

export type Drink = {
  topics_id: number
  slug: string
  subject: string
  subject_en: string
  /** When the drink was posted, an ISO 8601 string. */
  inst_ymdhi: string
  update_ymdhi: string
  description: string
  description_en: string
  contents: string
  contents_en: string
  /** Empty (`null` or `''`) when the drink has no thumbnail. */
  thumbnail: DrinkImage | null | ''
  /** Guarded like the fields below: develop read these unguarded, but one unfinished drink must not take a page down. */
  main_visuals: DrinkMainVisual[] | null
  manufacturer: string
  manufacturer_en: string
  abv: number | null
  /** Guarded as possibly empty: one unfinished drink must not take a page down. */
  drink_category: DrinkCategoryRef | null | ''
  tags: DrinkTag[] | null
  links: DrinkLink[] | null
  comment: string
  comment_en: string
}

export type DrinksPageInfo = {
  totalCnt: number
  perPage: number
  totalPageCnt: number
  pageNo: number
}

export type Drinks = {
  errors: string[]
  messages: string[]
  list: Drink[]
  pageInfo: DrinksPageInfo
}

export type DrinkDetail = {
  errors: string[]
  messages: string[]
  details: Drink
}
