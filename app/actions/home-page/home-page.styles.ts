// Ported from develop: app/routes/($lang)._public._layout._index/style.css.ts
import { CONTAINER_QUERY, MEDIA_QUERY } from '../../ui/styles/public/media-query.ts'
import { getClampPx, getTransition, type StyleRecipe } from '../../ui/styles/public/mixins.ts'
import { fontLargeBold, fontMediumBold } from '../../ui/styles/public/tokens.ts'

/** Slot: the page's outer element. */
export const home: StyleRecipe = {}

/** The title, the new arrivals and the categories each stack their parts with this gap. */
const SECTION_STACK: StyleRecipe = {
  display: 'grid',
  gap: getClampPx(24, 40),
  gridTemplateColumns: '1fr',
}

export const homeTitle_container: StyleRecipe = SECTION_STACK

export const homeTitleLogo: StyleRecipe = {
  display: 'flex',
}

export const homeTitleLogo_image: StyleRecipe = {
  blockSize: 'auto',
  inlineSize: '70%',
  maxInlineSize: '480px',
}

export const homeTitleLead_paragraph: StyleRecipe = {
  ...fontLargeBold,
  color: 'var(--color-font-sub-dark)',
}

export const homeNewArrivals_container: StyleRecipe = SECTION_STACK

/** Side by side from the `md` container width: the large cards, then the compact ones. */
export const homeNewArrivalsList: StyleRecipe = {
  [CONTAINER_QUERY.MD]: { display: 'flex' },
}

/** A container of its own, so `ArticleCardList`'s two columns follow this column's width. */
export const homeNewArrivalsList_main: StyleRecipe = {
  containerType: 'inline-size',
  flexGrow: 1,
}

export const homeNewArrivalsList_sub: StyleRecipe = {
  containerType: 'inline-size',
  flexShrink: 0,
  marginBlockStart: '24px',
  [CONTAINER_QUERY.MD]: { inlineSize: '50%', marginBlockStart: 0, marginInlineStart: '24px' },
  [CONTAINER_QUERY.LG]: { inlineSize: '40%' },
}

/** Centres the button under a section. */
export const homeSection_bottom: StyleRecipe = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
}

export const homeSearchCategory_container: StyleRecipe = SECTION_STACK

export const homeSearchCategoryList_items: StyleRecipe = {
  display: 'grid',
  gap: getClampPx(16, 24),
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
}

/** `PrimitiveButton`'s overrides for each category link. */
export const homeSearchCategoryListLink: StyleRecipe = {
  ...fontMediumBold,
  color: 'var(--color-font-sub-dark)',
  display: 'block',
  textAlign: 'center',
  [MEDIA_QUERY.HOVER]: { '&:hover': { color: 'var(--color-font-primary)' } },
}

export const homeSearchCategoryListLink_container: StyleRecipe = {
  alignItems: 'center',
  display: 'grid',
  gap: '8px',
  gridTemplateColumns: '1fr',
  justifyContent: 'center',
}

export const homeSearchCategoryListLinkThumbnail: StyleRecipe = {
  alignItems: 'center',
  aspectRatio: '1 / 1',
  borderRadius: 'calc(infinity * 1px)',
  display: 'flex',
  justifyContent: 'center',
  overflow: 'hidden',
}

/** Zooms while its link is hovered; the link is the image's ancestor `<a>`. */
export const homeSearchCategoryListLinkThumbnail_image: StyleRecipe = {
  blockSize: '100%',
  inlineSize: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  transition: getTransition([{ property: 'scale' }]),
  [MEDIA_QUERY.HOVER]: { 'a:hover &': { scale: 'var(--scale-hover)' } },
}

export const homeSearchCategoryListLink_title: StyleRecipe = {
  ...fontMediumBold,
}
