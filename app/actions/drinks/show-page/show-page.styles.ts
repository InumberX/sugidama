// Ported from develop: app/routes/($lang)._public._layout.drinks.$drinkId._index/style.css.ts
import { getClampPx, type StyleRecipe } from '../../../ui/styles/public/mixins.ts'

/** A row of cards under its section title. */
export const drinkRelated_container: StyleRecipe = {
  display: 'grid',
  gap: getClampPx(24, 40),
  gridTemplateColumns: 'minmax(0, 1fr)',
}

export const drinkBottom_container: StyleRecipe = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
}
