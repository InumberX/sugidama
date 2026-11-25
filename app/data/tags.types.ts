// Ported from develop: app/types/api/tags.d.ts, trimmed to the fields read

export type TagItem = {
  tag_id: number
  /** The title, in the language asked for (`_lang`): the name shown, unless the tag has a label. */
  tag_nm: string
  /**
   * The label, set only for a name the title cannot hold (a title cannot hold
   * a space, so `Slightly Funky` is the label of `slightly_funky`). The title
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
