import type { StyleRecipe } from '../../../../../../ui/styles/public/mixins.ts'
import { fontCaption } from '../../../../../../ui/styles/public/tokens.ts'

export const formSubSet: StyleRecipe = { paddingBlock: '8px', paddingInline: 0 }
export const formSubSet__first: StyleRecipe = { paddingBlockStart: 0 }
export const formSubSet__last: StyleRecipe = { paddingBlockEnd: 0 }

export const formSubSet_title: StyleRecipe = {
  ...fontCaption,
  color: 'var(--color-font-sub-dark)',
  display: 'flex',
}

export const formSubSet_contents: StyleRecipe = { marginBlockStart: '8px' }
