// Ported from develop: app/types/api/tags.d.ts, trimmed to the fields read

export type TagItem = {
  tag_id: number
  /** An identifier shaped like a slug (`slightly_funky`), the same in every language: a tag name cannot hold a space. */
  tag_nm: string
  /**
   * The display name, in the language asked for (`_lang`); the identifier
   * stands in when it is empty or only spaces. Guarded as possibly missing.
   */
  ext_col_01: string | null
}

export type TagCategory = {
  tag_category_id: number
  tag_category_nm: string
  /** Guarded as possibly empty, like a drink's own tags. */
  tags: Record<string, TagItem> | null
}

export type Tags = {
  errors: string[]
  messages: string[]
  list: TagCategory[]
}
