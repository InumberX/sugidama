// Ported from develop: app/types/api/tags.d.ts, trimmed to the fields read

export type TagItem = {
  tag_id: number
  /** The Japanese label. */
  tag_nm: string
  /** The English label. */
  ext_col_01: string
}

export type TagCategory = {
  tag_category_id: number
  tag_category_nm: string
  tags: Record<string, TagItem>
}

export type Tags = {
  errors: string[]
  messages: string[]
  list: TagCategory[]
}
