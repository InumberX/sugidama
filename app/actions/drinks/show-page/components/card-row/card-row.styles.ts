// Ported from develop: app/routes/($lang)._public._layout.drinks.$drinkId._index/style.css.ts
import { getClampPx, type StyleRecipe } from '../../../../../ui/styles/public/mixins.ts'

/** develop's `drinkRelated_container`: the title above the cards. */
export const cardRow_container: StyleRecipe = {
  display: 'grid',
  gap: getClampPx(24, 40),
  gridTemplateColumns: 'minmax(0, 1fr)',
}
