// Ported from develop: app/components/ui/cards/ArticleCompactCard/style.css.ts
//
// The hover works as in article-card.styles.ts: the card and its links'
// wrappers carry data attributes, and each rule sits in the recipe of the
// element it changes. develop also used `:has()` to trim the title's padding
// when a description or tags were present; the component knows that when it
// renders, so it picks the modifier recipes instead.
import { MEDIA_QUERY } from '../../../../ui/styles/public/media-query.ts'
import {
  getClampPx,
  getLineClamp,
  getTransition,
  type StyleRecipe,
} from '../../../../ui/styles/public/mixins.ts'
import { fontCaption, fontSmallBold } from '../../../../ui/styles/public/tokens.ts'

export const ARTICLE_COMPACT_CARD_ATTRIBUTE = 'data-article-compact-card'
export const ARTICLE_COMPACT_CARD_LINK_ATTRIBUTE = 'data-article-compact-card-link'

const WHILE_CARD_LINK_HOVERED = `[${ARTICLE_COMPACT_CARD_ATTRIBUTE}]:has([${ARTICLE_COMPACT_CARD_LINK_ATTRIBUTE}] > a:hover) &`

export const articleCompactCard: StyleRecipe = {
  backgroundColor: 'var(--color-background-sub-light)',
  blockSize: '100%',
  borderRadius: '12px',
  display: 'grid',
  gridTemplateAreas: '"thumbnail description" "thumbnail title" "thumbnail tags"',
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: 'auto 1fr auto',
  overflow: 'hidden',
}

export const articleCompactCardDescription: StyleRecipe = {
  gridArea: 'description',
}

export const articleCompactCardDescription_container: StyleRecipe = {
  ...fontCaption,
  alignItems: 'flex-start',
  blockSize: '100%',
  color: 'var(--color-font-sub-dark)',
  display: 'flex',
  inlineSize: '100%',
  paddingBlock: '12px 0',
  paddingInline: '12px',
}

export const articleCompactCardDescription_text: StyleRecipe = {
  ...getLineClamp(2),
}

export const articleCompactCardTags: StyleRecipe = {
  gridArea: 'tags',
  marginBlockStart: '8px',
  paddingBlockEnd: '12px',
  paddingInline: '12px',
}

export const articleCompactCardThumbnail: StyleRecipe = {
  gridArea: 'thumbnail',
  position: 'relative',
}

export const articleCompactCardThumbnail_container: StyleRecipe = {
  alignItems: 'flex-start',
  blockSize: '100%',
  display: 'flex',
  inlineSize: getClampPx(120, 160),
  paddingBlock: '12px',
  paddingInline: '12px 0',
  zIndex: 1,
}

export const articleCompactCardThumbnail_contents: StyleRecipe = {
  aspectRatio: '16 / 9',
  borderRadius: '8px',
  display: 'block',
  inlineSize: '100%',
  overflow: 'hidden',
}

export const articleCompactCardThumbnail_image: StyleRecipe = {
  blockSize: '100%',
  inlineSize: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  transition: getTransition([{ property: 'scale' }]),
  [MEDIA_QUERY.HOVER]: { [WHILE_CARD_LINK_HOVERED]: { scale: 'var(--scale-hover)' } },
}

export const articleCompactCardTitle: StyleRecipe = {
  gridArea: 'title',
}

export const articleCompactCardTitle_container: StyleRecipe = {
  ...fontSmallBold,
  alignItems: 'flex-start',
  blockSize: '100%',
  color: 'var(--color-font-base)',
  display: 'flex',
  inlineSize: '100%',
  padding: '12px',
  transition: getTransition([{ property: 'color' }]),
  [MEDIA_QUERY.HOVER]: { [WHILE_CARD_LINK_HOVERED]: { color: 'var(--color-font-primary)' } },
}

/** Closer to the description above it. */
export const articleCompactCardTitle_container__afterDescription: StyleRecipe = {
  paddingBlockStart: '4px',
}

/** The tags below bring their own spacing. */
export const articleCompactCardTitle_container__beforeTags: StyleRecipe = {
  paddingBlockEnd: 0,
}

export const articleCompactCardTitle_text: StyleRecipe = {
  ...getLineClamp(2),
}
