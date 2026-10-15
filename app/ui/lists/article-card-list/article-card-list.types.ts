import type { ArticleCardProps } from '../../cards/article-card/article-card.types.ts'

export type ArticleCardListItemSize = 'small' | 'medium' | 'twoColumns'

export type ArticleCardListProps = {
  items: ArticleCardProps[]
  /**
   * `small` / `medium` fill the row with cards of at least 240px / 300px;
   * `twoColumns` is one column, then two from the `sm` container width.
   */
  itemSize?: ArticleCardListItemSize
}
