export type ArticleInfoLink = { text: string; url: string }

export type ArticleInfoItem = {
  title: string
  /** Plain text; each `\n` becomes a line break. */
  text?: string
  /** Other sites, each opened in a new tab. */
  links?: ArticleInfoLink[]
}

export type ArticleInfoProps = {
  items: ArticleInfoItem[]
}
