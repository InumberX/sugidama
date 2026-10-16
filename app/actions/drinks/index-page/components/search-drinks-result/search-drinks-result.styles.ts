// Ported from develop: SearchDrinksResult/style.css.ts.
import type { StyleRecipe } from '../../../../../ui/styles/public/mixins.ts'
import { fontLargeBold, fontMedium } from '../../../../../ui/styles/public/tokens.ts'

/** Pagination links jump here, so a new page opens at its results. */
export const searchDrinksResult: StyleRecipe = { scrollMarginBlockStart: '80px' }

export const searchDrinksResult_pagination: StyleRecipe = { marginBlockStart: '40px' }

export const searchDrinksResultNoResult: StyleRecipe = {
  display: 'grid',
  gap: '16px',
  paddingBlock: '40px',
  textAlign: 'center',
}

export const searchDrinksResultNoResult_title: StyleRecipe = fontLargeBold

export const searchDrinksResultNoResult_description: StyleRecipe = fontMedium
