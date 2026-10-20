// Ported from develop: app/components/ui/articles/BaseArticle/style.css.ts
import { CONTAINER_QUERY } from '../../../../../ui/styles/public/media-query.ts'
import { getClampPx, type StyleRecipe } from '../../../../../ui/styles/public/mixins.ts'

/** The container ArticleInfo's queries resolve against, too. */
export const baseArticle: StyleRecipe = {
  containerType: 'inline-size',
}

/** Stacked below `sm`; from `sm` the images take the left half beside the rest. */
export const baseArticle_container: StyleRecipe = {
  display: 'grid',
  gridTemplateAreas: '"title" "main-visual" "info" "tags"',
  gridTemplateColumns: 'minmax(0, 1fr)',
  [CONTAINER_QUERY.SM]: {
    gap: `0 ${getClampPx(24, 80)}`,
    gridTemplateAreas: '"main-visual title" "main-visual info" "main-visual tags"',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gridTemplateRows: 'auto auto 1fr',
  },
}

export const baseArticleTitle: StyleRecipe = {
  gridArea: 'title',
}

export const baseArticleMainVisual: StyleRecipe = {
  gridArea: 'main-visual',
  marginBlockStart: '16px',
  [CONTAINER_QUERY.SM]: {
    marginBlockStart: 0,
  },
}

export const baseArticleInfo: StyleRecipe = {
  gridArea: 'info',
  marginBlockStart: '16px',
}

export const baseArticleTags: StyleRecipe = {
  gridArea: 'tags',
  marginBlockStart: '16px',
}
