// Ported from develop: app/components/ui/cards/ArticleCard/style.css.ts
//
// Hovering any of the card's own links (title, date, thumbnail — not a tag)
// recolors the title and zooms the image. develop marked those links with a
// class; here the card and the links' wrappers carry data attributes, and the
// hover rule sits in the recipe of the element it changes. It cannot sit in the
// card's recipe: every css(...) gets its own sublayer, ordered by first render,
// so the card's — rendered first — would lose to the title's own `color`
// whatever its specificity.
import { MEDIA_QUERY } from '../../styles/public/media-query.ts'
import { getLineClamp, getTransition, type StyleRecipe } from '../../styles/public/mixins.ts'
import { fontCaption, fontMediumBold } from '../../styles/public/tokens.ts'

export const ARTICLE_CARD_ATTRIBUTE = 'data-article-card'
export const ARTICLE_CARD_LINK_ATTRIBUTE = 'data-article-card-link'

/** Matches the element the recipe is on while one of its card's own links is hovered. */
const WHILE_CARD_LINK_HOVERED = `[${ARTICLE_CARD_ATTRIBUTE}]:has([${ARTICLE_CARD_LINK_ATTRIBUTE}] > a:hover) &`

export const articleCard: StyleRecipe = {
  backgroundColor: 'var(--color-background-sub-light)',
  blockSize: '100%',
  borderRadius: '16px',
  display: 'grid',
  gridTemplateAreas: '"thumbnail" "description" "title" "tags"',
  gridTemplateColumns: '1fr',
  overflow: 'hidden',
  paddingBlockEnd: '16px',
}

export const articleCardTitle: StyleRecipe = {
  gridArea: 'title',
}

export const articleCardTitle_text: StyleRecipe = {
  ...fontMediumBold,
  blockSize: '100%',
  color: 'var(--color-font-base)',
  inlineSize: '100%',
  paddingBlock: '12px 0',
  paddingInline: '16px',
  ...getLineClamp(3),
  transition: getTransition([{ property: 'color' }]),
  [MEDIA_QUERY.HOVER]: { [WHILE_CARD_LINK_HOVERED]: { color: 'var(--color-font-primary)' } },
}

export const articleCardDescription: StyleRecipe = {
  gridArea: 'description',
}

export const articleCardDescription_container: StyleRecipe = {
  ...fontCaption,
  blockSize: '100%',
  color: 'var(--color-font-sub-dark)',
  display: 'flex',
  inlineSize: '100%',
  paddingBlock: '12px 0',
  paddingInline: '16px',
}

export const articleCardDescription_text: StyleRecipe = {
  ...getLineClamp(2),
}

export const articleCardTags: StyleRecipe = {
  gridArea: 'tags',
  marginBlockStart: '12px',
  paddingInline: '16px',
}

export const articleCardThumbnail: StyleRecipe = {
  gridArea: 'thumbnail',
  position: 'relative',
}

export const articleCardThumbnail_container: StyleRecipe = {
  blockSize: '100%',
  display: 'flex',
  inlineSize: '100%',
  zIndex: 1,
}

export const articleCardThumbnail_contents: StyleRecipe = {
  aspectRatio: '16 / 9',
  inlineSize: '100%',
  overflow: 'hidden',
}

export const articleCardThumbnail_image: StyleRecipe = {
  blockSize: '100%',
  inlineSize: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  transition: getTransition([{ property: 'scale' }]),
  [MEDIA_QUERY.HOVER]: { [WHILE_CARD_LINK_HOVERED]: { scale: 'var(--scale-hover)' } },
}
