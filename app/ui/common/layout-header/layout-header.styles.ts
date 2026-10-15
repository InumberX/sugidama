// Ported from develop: app/components/common/LayoutHeader/style.css.ts
//
// Below `sm` the header scrolls away with the page and the global menu is a
// bar fixed to the bottom of the screen; from `sm` the header is fixed to the
// top and holds the menu itself. The bars and rounded corners draw the grey
// frame around the white sheet in the gap `LayoutMain`'s gutter leaves, so
// their thickness is that gutter.
import { MEDIA_QUERY, MEDIA_QUERY_REVERSE } from '../../styles/public/media-query.ts'
import { getClampPx, getTransition, type StyleRecipe } from '../../styles/public/mixins.ts'
import { fontMediumBold, fontSmallBold } from '../../styles/public/tokens.ts'

const FRAME = 'var(--layout-main-gutter)'
const HEADER_HEIGHT = 'var(--layout-header-height)'
const FRAME_COLOR = 'var(--color-background-sub-light)'

/** A quarter circle cut out of a frame-colored square, centred on the corner `at`. */
const cornerOf = (at: string): string =>
  `radial-gradient(circle at ${at}, transparent ${FRAME}, ${FRAME_COLOR} ${FRAME})`

export const layoutHeader: StyleRecipe = {
  inlineSize: '100%',
  insetBlockStart: 0,
  insetInlineStart: 0,
  paddingBlockStart: FRAME,
  paddingInline: FRAME,
  position: 'absolute',
  zIndex: 'var(--z-index-header-wrapper)',
  [MEDIA_QUERY.SM]: {
    backgroundColor: FRAME_COLOR,
    paddingBlockStart: 0,
    paddingInline: 0,
    position: 'fixed',
  },
}

export const layoutHeaderBar: StyleRecipe = {
  backgroundColor: FRAME_COLOR,
  blockSize: FRAME,
  display: 'block',
  inlineSize: '100%',
  insetInlineStart: 0,
  position: 'fixed',
  zIndex: 'var(--z-index-header-bar)',
}

/** The frame's top edge below `sm`; from `sm` the header itself covers it. */
export const layoutHeaderBar__top: StyleRecipe = {
  insetBlockStart: 0,
  [MEDIA_QUERY.SM]: { display: 'none' },
}

/** Above the bottom menu below `sm`, at the bottom of the screen from `sm`. */
export const layoutHeaderBar__bottom: StyleRecipe = {
  display: 'none',
  insetBlockEnd: HEADER_HEIGHT,
  [MEDIA_QUERY.SM]: { display: 'block', insetBlockEnd: 0 },
}

export const layoutHeaderCorner: StyleRecipe = {
  aspectRatio: '1 / 1',
  blockSize: 'auto',
  display: 'block',
  inlineSize: FRAME,
  position: 'fixed',
  zIndex: 'var(--z-index-header-bar)',
}

export const layoutHeaderCorner__topLeft: StyleRecipe = {
  background: cornerOf('bottom right'),
  insetBlockStart: FRAME,
  insetInlineStart: FRAME,
  [MEDIA_QUERY.SM]: { insetBlockStart: HEADER_HEIGHT },
}

export const layoutHeaderCorner__topRight: StyleRecipe = {
  background: cornerOf('bottom left'),
  insetBlockStart: FRAME,
  insetInlineEnd: FRAME,
  [MEDIA_QUERY.SM]: { insetBlockStart: HEADER_HEIGHT },
}

export const layoutHeaderCorner__bottomLeft: StyleRecipe = {
  background: cornerOf('top right'),
  insetBlockEnd: HEADER_HEIGHT,
  insetInlineStart: FRAME,
  [MEDIA_QUERY.SM]: { insetBlockEnd: FRAME },
}

export const layoutHeaderCorner__bottomRight: StyleRecipe = {
  background: cornerOf('top left'),
  insetBlockEnd: HEADER_HEIGHT,
  insetInlineEnd: FRAME,
  [MEDIA_QUERY.SM]: { insetBlockEnd: FRAME },
}

/** Slot: the element around the inner. */
export const layoutHeader_wrapper: StyleRecipe = {}

/**
 * `LayoutInner`'s overrides: as wide as `LayoutMain`, with the frame as its
 * padding from `sm`. Both breakpoints are repeated because the spread is
 * shallow — develop got the same result from a stronger cascade layer.
 */
export const layoutHeader_inner: StyleRecipe = {
  maxInlineSize: `calc(var(--layout-inner-max-width-large) + (${FRAME} * 2))`,
  [MEDIA_QUERY.SM]: { paddingInline: FRAME },
  [MEDIA_QUERY.MD]: { paddingInline: FRAME },
}

export const layoutHeader_container: StyleRecipe = {
  blockSize: HEADER_HEIGHT,
  display: 'grid',
  gap: getClampPx(16, 24),
  gridTemplateColumns: 'auto 1fr',
}

export const layoutHeaderLogo: StyleRecipe = {
  blockSize: '100%',
}

export const layoutHeaderLogo_title: StyleRecipe = {
  blockSize: '100%',
}

/** `PrimitiveButton`'s overrides, like every link in the header. */
export const layoutHeaderLogo_link: StyleRecipe = {
  blockSize: '100%',
  display: 'flex',
  transition: getTransition([{ property: 'opacity' }]),
  [MEDIA_QUERY.HOVER]: { '&:hover': { opacity: 'var(--opacity-hover)' } },
}

export const layoutHeaderLogo_image: StyleRecipe = {
  blockSize: 'auto',
  inlineSize: getClampPx(120, 160),
}

export const layoutHeaderMenu: StyleRecipe = {
  blockSize: '100%',
}

export const layoutHeaderMenu_container: StyleRecipe = {
  blockSize: '100%',
  [MEDIA_QUERY.SM]: {
    alignItems: 'center',
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  },
}

/** A bar fixed to the bottom of the screen below `sm`; part of the header row from `sm`. */
export const layoutHeaderMenuGlobal: StyleRecipe = {
  blockSize: HEADER_HEIGHT,
  inlineSize: '100%',
  insetBlockEnd: 0,
  insetInlineStart: 0,
  paddingInline: FRAME,
  position: 'fixed',
  zIndex: 'var(--z-index-header-global)',
  [MEDIA_QUERY.SM]: {
    blockSize: '100%',
    inlineSize: 'auto',
    insetBlockEnd: 'auto',
    insetInlineStart: 'auto',
    paddingInline: 0,
    position: 'static',
  },
}

export const layoutHeaderMenuGlobal_container: StyleRecipe = {
  blockSize: '100%',
  [MEDIA_QUERY_REVERSE.SM]: { backgroundColor: FRAME_COLOR },
}

export const layoutHeaderMenuGlobal_navigation: StyleRecipe = {
  blockSize: '100%',
  [MEDIA_QUERY.SM]: { display: 'flex', justifyContent: 'flex-end' },
}

export const layoutHeaderMenuGlobal_items: StyleRecipe = {
  blockSize: '100%',
  display: 'flex',
}

/** Items are separated by a short vertical rule, drawn before every item but the first. */
export const layoutHeaderMenuGlobal_item: StyleRecipe = {
  blockSize: '100%',
  flexGrow: 1,
  position: 'relative',
  '&::before': {
    backgroundColor: 'var(--color-background-sub)',
    blockSize: '40%',
    content: '""',
    inlineSize: '1px',
    insetBlockStart: '50%',
    insetInlineStart: 0,
    position: 'absolute',
    translate: '0 -50%',
  },
  '&:first-of-type::before': { content: 'none' },
}

export const layoutHeaderMenuGlobal_link: StyleRecipe = {
  ...fontSmallBold,
  blockSize: '100%',
  color: 'var(--color-font-base)',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  justifyContent: 'center',
  paddingBlock: '4px',
  paddingInline: '16px',
  [MEDIA_QUERY.HOVER]: { '&:hover': { color: 'var(--color-font-primary)' } },
  [MEDIA_QUERY.SM]: { flexDirection: 'row', gap: '8px', paddingInline: '20px' },
  [MEDIA_QUERY.MD]: { paddingInline: '26px' },
  [MEDIA_QUERY.LG]: { paddingInline: '32px' },
  [MEDIA_QUERY.XL]: { paddingInline: '36px' },
  [MEDIA_QUERY.XXL]: { paddingInline: '40px' },
}

/** `SvgIcon`'s overrides: `currentColor`, so the icon follows the link's hover color. */
export const layoutHeaderMenuGlobal_icon: StyleRecipe = {
  backgroundColor: 'currentColor',
  inlineSize: getClampPx(20, 24),
}

export const layoutHeaderMenuGlobal_text: StyleRecipe = {
  display: 'block',
}

export const layoutHeaderMenuLanguage: StyleRecipe = {
  blockSize: '100%',
}

export const layoutHeaderMenuLanguage_items: StyleRecipe = {
  alignItems: 'center',
  blockSize: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
}

/** Slot: each language. */
export const layoutHeaderMenuLanguage_item: StyleRecipe = {}

export const layoutHeaderMenuLanguage_contents: StyleRecipe = {
  alignItems: 'center',
  display: 'flex',
}

/** `SvgIcon`'s overrides for the slash between the languages. */
export const layoutHeaderMenuLanguage_icon: StyleRecipe = {
  backgroundColor: 'var(--color-background-sub-dark)',
  flexShrink: 0,
  inlineSize: '24px',
}

export const layoutHeaderMenuLanguage_current: StyleRecipe = {
  ...fontMediumBold,
  color: 'var(--color-font-base)',
}

/** `PrimitiveButton`'s overrides for the other language. */
export const layoutHeaderMenuLanguageLink: StyleRecipe = {
  ...fontMediumBold,
  color: 'var(--color-font-sub-dark)',
  [MEDIA_QUERY.HOVER]: { '&:hover': { color: 'var(--color-font-primary)' } },
}

export const layoutHeaderMenuLanguageLink_text: StyleRecipe = {
  display: 'block',
}
