// Ported from develop: app/components/ui/articles/ArticleInfo/style.css.ts
//
// The `sm` queries resolve against BaseArticle, the nearest container.
import { CONTAINER_QUERY } from '../../../../../ui/styles/public/media-query.ts'
import { getClampPx, type StyleRecipe } from '../../../../../ui/styles/public/mixins.ts'
import { fontMedium, fontMediumBold } from '../../../../../ui/styles/public/tokens.ts'

const BORDER = '1px solid var(--color-border-sub)'

/** One `dl`: below `sm` each term sits above its text, from `sm` beside it. */
export const articleInfo: StyleRecipe = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  [CONTAINER_QUERY.SM]: {
    gridTemplateColumns: 'auto 1fr',
  },
}

/**
 * A term and its text. develop wrote one `dl` per pair; a `div` per pair
 * inside one `dl` is the same grid and one list to assistive technology. The
 * subgrid lines every term up in the first column.
 */
export const articleInfo_item: StyleRecipe = {
  borderBlockStart: BORDER,
  paddingBlock: getClampPx(8, 12),
  '&:last-child': {
    borderBlockEnd: BORDER,
  },
  [CONTAINER_QUERY.SM]: {
    display: 'grid',
    gridColumn: 'span 2',
    gridTemplateColumns: 'subgrid',
  },
}

export const articleInfo_title: StyleRecipe = {
  ...fontMediumBold,
  color: 'var(--color-font-sub-dark)',
  [CONTAINER_QUERY.SM]: {
    display: 'flex',
    '&::after': {
      content: '":"',
      display: 'block',
      flexShrink: 0,
      marginInlineStart: 'auto',
      paddingInline: '8px',
    },
  },
}

export const articleInfo_text: StyleRecipe = {
  ...fontMedium,
}

/** Slot: the list of links in a text. */
export const articleInfoLinks: StyleRecipe = {}

/** Slot: one link. */
export const articleInfoLinks_item: StyleRecipe = {}

export const articleInfoLinks_icon: StyleRecipe = {
  backgroundColor: 'var(--color-background-sub-dark)',
}
