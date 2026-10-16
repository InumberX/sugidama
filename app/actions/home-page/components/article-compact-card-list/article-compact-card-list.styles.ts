// Ported from develop: app/components/ui/lists/ArticleCompactCardList/style.css.ts
import type { StyleRecipe } from '../../../../ui/styles/public/mixins.ts'

export const articleCompactCardList: StyleRecipe = {
  display: 'block',
  inlineSize: '100%',
}

export const articleCompactCardList_items: StyleRecipe = {
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: '1fr',
}

/** Slot: each row. */
export const articleCompactCardList_item: StyleRecipe = {}
