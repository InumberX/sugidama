// Ported from develop: app/components/ui/lists/BaseTagList/style.css.ts
import type { StyleRecipe } from '../../styles/public/mixins.ts'
import type { BaseTagListAlign } from './base-tag-list.types.ts'

export const baseTagList: StyleRecipe = {
  display: 'block',
}

export const baseTagList_items: StyleRecipe = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
}

export const baseTagList_items__left: StyleRecipe = { justifyContent: 'flex-start' }
export const baseTagList_items__center: StyleRecipe = { justifyContent: 'center' }
export const baseTagList_items__right: StyleRecipe = { justifyContent: 'flex-end' }

export const baseTagListAligns: Record<BaseTagListAlign, StyleRecipe> = {
  left: baseTagList_items__left,
  center: baseTagList_items__center,
  right: baseTagList_items__right,
}

export const baseTagList_item: StyleRecipe = {
  display: 'block',
}
