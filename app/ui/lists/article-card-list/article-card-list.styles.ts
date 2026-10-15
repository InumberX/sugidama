// Ported from develop: app/components/ui/lists/ArticleCardList/style.css.ts
import { CONTAINER_QUERY } from '../../styles/public/media-query.ts'
import type { StyleRecipe } from '../../styles/public/mixins.ts'
import type { ArticleCardListItemSize } from './article-card-list.types.ts'

export const articleCardList: StyleRecipe = {
  display: 'block',
  inlineSize: '100%',
}

export const articleCardList_items: StyleRecipe = {
  display: 'grid',
  gap: '24px',
}

export const articleCardList_items__small: StyleRecipe = {
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))',
}

export const articleCardList_items__medium: StyleRecipe = {
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
}

/** Measured against the nearest container: `LayoutMain` unless something closer opens one. */
export const articleCardList_items__twoColumns: StyleRecipe = {
  gridTemplateColumns: 'repeat(1, 1fr)',
  [CONTAINER_QUERY.SM]: { gridTemplateColumns: 'repeat(2, 1fr)' },
}

export const articleCardListItemSizes: Record<ArticleCardListItemSize, StyleRecipe> = {
  small: articleCardList_items__small,
  medium: articleCardList_items__medium,
  twoColumns: articleCardList_items__twoColumns,
}

/** Slot: each grid cell. */
export const articleCardList_item: StyleRecipe = {}
