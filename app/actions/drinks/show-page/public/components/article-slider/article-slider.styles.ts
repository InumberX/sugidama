// Ported from develop: app/components/ui/articles/ArticleSlider/style.css.ts
//
// Two states. Until the client entry has started keen-slider — and without
// JavaScript at all — the main images are a scroll-snap strip the visitor can
// swipe through, and the thumbnails are hidden. Once keen-slider runs, the
// strip takes keen-slider's own container rules (keen-slider.css, copied here
// rather than loaded, so they land in the `rmx` layer with everything else)
// and the thumbnails appear. The strip's and the slides' `__started` recipes
// replace their bases rather than being spread over them: the two states share
// no declaration worth keeping.
import { MEDIA_QUERY } from '../../../../../../ui/styles/public/media-query.ts'
import { getTransition, type StyleRecipe } from '../../../../../../ui/styles/public/mixins.ts'

/** Between thumbnails; keen-slider's `spacing` and the static row use the same value. */
export const THUMBNAIL_SPACING = 16

export const articleSlider: StyleRecipe = {
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'minmax(0, 1fr)',
}

/** keen-slider.css's `.keen-slider:not([data-keen-slider-disabled])`. */
const keenContainer: StyleRecipe = {
  alignContent: 'flex-start',
  display: 'flex',
  inlineSize: '100%',
  overflow: 'hidden',
  position: 'relative',
  touchAction: 'pan-y',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
}

/** keen-slider.css's `.keen-slider__slide`; keen-slider sets each slide's width inline. */
const keenSlide: StyleRecipe = {
  inlineSize: '100%',
  minBlockSize: '100%',
  overflow: 'hidden',
  position: 'relative',
}

export const articleSliderMain: StyleRecipe = {
  display: 'flex',
  overflowX: 'auto',
  overscrollBehaviorX: 'contain',
  scrollSnapType: 'x mandatory',
  scrollbarWidth: 'thin',
}

export const articleSliderMain__started: StyleRecipe = keenContainer

export const articleSliderMain_slide: StyleRecipe = {
  flex: '0 0 100%',
  scrollSnapAlign: 'start',
}

export const articleSliderMain_slide__started: StyleRecipe = keenSlide

export const articleSliderMainImage: StyleRecipe = {
  alignItems: 'center',
  borderRadius: '8px',
  display: 'flex',
  inlineSize: '100%',
  justifyContent: 'center',
  overflow: 'hidden',
}

export const articleSliderMainImage_image: StyleRecipe = {
  blockSize: 'auto',
  inlineSize: '100%',
}

/**
 * The thumbnails and their buttons. Laid out but transparent until started, as
 * develop did, so the row already has its height when it appears; with
 * scripting off it is never shown, because nothing would make it work.
 */
export const articleSliderSub: StyleRecipe = {
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  opacity: 0,
  [MEDIA_QUERY.NOT_SCRIPTING]: { display: 'none' },
}

export const articleSliderSub__started: StyleRecipe = {
  opacity: 1,
}

export const articleSliderSubButton: StyleRecipe = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
}

export const articleSliderSub_slider: StyleRecipe = keenContainer

/** A thumbnail's width at keen-slider's `perView` for the viewport, before keen-slider sets it. */
const thumbnailBasis = (perView: number): StyleRecipe => ({
  flex: `0 0 calc((100% - ${THUMBNAIL_SPACING * (perView - 1)}px) / ${perView})`,
})

export const articleSliderSub_slide: StyleRecipe = {
  ...thumbnailBasis(2),
  marginInlineEnd: `${THUMBNAIL_SPACING}px`,
  [MEDIA_QUERY.MD]: thumbnailBasis(2.4),
  [MEDIA_QUERY.LG]: thumbnailBasis(3),
  [MEDIA_QUERY.XL]: thumbnailBasis(4),
}

/** keen-slider positions the slides itself; the static row's sizes would only get in its way. */
export const articleSliderSub_slide__started: StyleRecipe = keenSlide

/** The thumbnail button; its `::after` is the gradient frame of the current one. */
export const articleSliderSubImage: StyleRecipe = {
  alignItems: 'center',
  background: 'transparent',
  border: 'none',
  borderRadius: '4px',
  color: 'inherit',
  display: 'flex',
  font: 'inherit',
  inlineSize: '100%',
  justifyContent: 'center',
  overflow: 'hidden',
  padding: '2px',
  position: 'relative',
  '&::after': {
    background: 'linear-gradient(90deg, var(--color-gradation-primary))',
    blockSize: '100%',
    content: '""',
    display: 'block',
    inlineSize: '100%',
    insetBlockStart: 0,
    insetInlineStart: 0,
    opacity: 0,
    position: 'absolute',
    transition: getTransition([{ property: 'opacity' }]),
    zIndex: 1,
  },
  [MEDIA_QUERY.HOVER]: {
    '&:hover img': { scale: 'var(--scale-hover)' },
  },
}

export const articleSliderSubImage__current: StyleRecipe = {
  '&::after': {
    ...(articleSliderSubImage['&::after'] as StyleRecipe),
    opacity: 1,
  },
}

export const articleSliderSubImage_contents: StyleRecipe = {
  alignItems: 'center',
  aspectRatio: '16 / 9',
  borderRadius: '4px',
  display: 'flex',
  inlineSize: '100%',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 2,
}

export const articleSliderSubImage_image: StyleRecipe = {
  blockSize: '100%',
  inlineSize: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  transition: getTransition([{ property: 'scale' }]),
}
