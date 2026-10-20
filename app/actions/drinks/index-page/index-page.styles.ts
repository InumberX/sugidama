// Ported from develop: app/routes/($lang)._public._layout.drinks._index/style.css.ts
import { CONTAINER_QUERY } from '../../../ui/styles/public/media-query.ts'
import { getClampPx, type StyleRecipe } from '../../../ui/styles/public/mixins.ts'

export const drinks_container: StyleRecipe = {
  display: 'grid',
  gridTemplateAreas: '"side" "result"',
  gridTemplateColumns: '1fr',
  [CONTAINER_QUERY.MD]: {
    gap: `0 ${getClampPx(24, 40)}`,
    gridTemplateAreas: '"side result"',
    gridTemplateColumns: `${getClampPx(240, 360)} 1fr`,
  },
}

export const drinks_side: StyleRecipe = {
  gridArea: 'side',
  [CONTAINER_QUERY.MD]: {
    borderInlineEnd: '1px solid var(--color-border-sub)',
    paddingInlineEnd: getClampPx(24, 40),
  },
}

export const drinks_result: StyleRecipe = {
  gridArea: 'result',
  marginBlockStart: '40px',
  [CONTAINER_QUERY.MD]: { marginBlockStart: 0 },
}
