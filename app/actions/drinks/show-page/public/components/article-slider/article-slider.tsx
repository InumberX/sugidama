// Ported from develop: app/components/ui/articles/ArticleSlider
//
// A client entry around keen-slider's vanilla core (develop used its React
// wrapper): the main image and a row of thumbnails, both looping, each moving
// the other. Until it starts — and without JavaScript — the images are a
// scroll-snap strip (see the styles).
import keenSlider, { type KeenSliderInstance, type KeenSliderOptions } from 'keen-slider'
import { clientEntry, css, on, ref, type Handle } from 'remix/component'

import { clientModuleUrl } from '../../../../../../ui/public/client-module-url.ts'
import { BREAKPOINTS } from '../../../../../../ui/styles/public/breakpoints.ts'
import { SvgIconCircleButton } from '../svg-icon-circle-button/svg-icon-circle-button.tsx'
import * as styles from './article-slider.styles.ts'
import type { ArticleSliderProps, ArticleSliderSlide } from './article-slider.types.ts'

export type * from './article-slider.types.ts'

type KeenSliderClass = typeof keenSlider.default

/**
 * The browser build reads the package's `module` field and hands over the
 * class itself. Node (the tests) and TypeScript read it as CommonJS — it has
 * no `"type"` or `"exports"` — so there the default import is `module.exports`
 * and the class is its `default`. Only the browser ever constructs one.
 */
const KeenSlider: KeenSliderClass =
  (keenSlider as { default?: KeenSliderClass }).default ??
  (keenSlider as unknown as KeenSliderClass)

type Item = ArticleSliderSlide & {
  /** A copy made for the loop: hidden from assistive technology and the tab order. */
  isCopy: boolean
}

/**
 * keen-slider's loop needs more slides than fit in view, or it shows gaps; four
 * thumbnails fit at `xl`. develop repeated short lists the same way.
 */
const toLoopItems = (slides: ArticleSliderSlide[]): Item[] => {
  const times = slides.length <= 2 ? 3 : slides.length <= 4 ? 2 : 1
  return Array.from({ length: times }, (_, copy) =>
    slides.map((slide) => ({ ...slide, isCopy: copy > 0 }))
  ).flat()
}

const thumbnailSlides = (perView: number) => ({
  origin: 'center' as const,
  perView,
  spacing: styles.THUMBNAIL_SPACING,
})

const THUMBNAIL_OPTIONS: KeenSliderOptions = {
  loop: true,
  slides: thumbnailSlides(2),
  breakpoints: {
    [`(width >= ${BREAKPOINTS.md}px)`]: { slides: thumbnailSlides(2.4) },
    [`(width >= ${BREAKPOINTS.lg}px)`]: { slides: thumbnailSlides(3) },
    [`(width >= ${BREAKPOINTS.xl}px)`]: { slides: thumbnailSlides(4) },
  },
}

/**
 * Every element child is a slide; keen-slider's default looks for a class. An
 * array, because keen-slider takes an array or a NodeList and treats anything
 * else — `children` is an HTMLCollection — as no slides at all.
 */
const children = (container: HTMLElement | Document) =>
  container instanceof HTMLElement
    ? [...container.children].filter((c) => c instanceof HTMLElement)
    : []

export const ArticleSlider = clientEntry(
  clientModuleUrl(
    'app/actions/drinks/show-page/public/components/article-slider/article-slider.tsx'
  ),
  function ArticleSlider(handle: Handle<ArticleSliderProps>) {
    // The server renders the slides once each; the copies the loop needs are
    // added only when keen-slider starts, so the strip without it shows no
    // image twice.
    let items: Item[] = handle.props.slides.map((slide) => ({ ...slide, isCopy: false }))
    let isStarted = false
    let current = 0
    let main: KeenSliderInstance | undefined
    let thumbnails: KeenSliderInstance | undefined

    const select = (index: number) => {
      if (index === current) return
      current = index
      void handle.update()
    }

    const start = ref(async (node: HTMLElement, signal: AbortSignal) => {
      const { slides } = handle.props
      if (slides.length < 2) return
      const mainNode = node.querySelector<HTMLElement>('[data-slider="main"]')
      if (!mainNode) return
      // Whatever the visitor swiped to in the strip is where the slider starts.
      const initial = Math.min(
        Math.round(mainNode.scrollLeft / Math.max(mainNode.clientWidth, 1)),
        slides.length - 1
      )

      items = toLoopItems(slides)
      isStarted = true
      current = initial
      await handle.update()
      if (signal.aborted) return

      const thumbnailNode = node.querySelector<HTMLElement>('[data-slider="thumbnails"]')
      // The main slider is the one source of the current image; the
      // thumbnails follow it. develop let each slider move the other from its
      // `slideChanged`, but a move passes through every slide between, so
      // each slide passed sent the other slider back there and a jump of more
      // than one stopped short. Changes the thumbnails make while following
      // are ignored; only the visitor dragging them moves the main slider.
      let isFollowing = false
      const stopFollowing = () => {
        isFollowing = false
      }
      // keen-slider logs and returns nothing when it cannot start.
      main = new KeenSlider(mainNode, {
        initial,
        loop: true,
        selector: children,
        slides: { perView: 1, spacing: 0 },
        slideChanged: (slider) => {
          const { rel } = slider.track.details
          if (thumbnails && thumbnails.track.details.rel !== rel) {
            thumbnails.moveToIdx(rel)
            // After the call: redirecting a running animation stops it, which
            // fires `animationStopped` synchronously and would clear the flag.
            isFollowing = true
          }
          select(rel)
        },
      }) as KeenSliderInstance | undefined
      thumbnails = thumbnailNode
        ? (new KeenSlider(thumbnailNode, {
            ...THUMBNAIL_OPTIONS,
            initial,
            selector: children,
            slideChanged: (slider) => {
              if (!isFollowing) main?.moveToIdx(slider.track.details.rel)
            },
            animationEnded: stopFollowing,
            animationStopped: stopFollowing,
            dragStarted: stopFollowing,
          }) as KeenSliderInstance | undefined)
        : undefined

      if (!main || !thumbnails) {
        // Back to the strip, which works on its own.
        main?.destroy()
        thumbnails?.destroy()
        main = thumbnails = undefined
        items = slides.map((slide) => ({ ...slide, isCopy: false }))
        isStarted = false
        void handle.update()
        return
      }

      // A focused thumbnail scrolls its `overflow: hidden` row to show itself,
      // which keen-slider does not know about; put the row back.
      const unscroll = (event: Event) => {
        if (event.target instanceof HTMLElement) event.target.scrollLeft = 0
      }
      mainNode.addEventListener('scroll', unscroll, { signal })
      thumbnailNode?.addEventListener('scroll', unscroll, { signal })
      signal.addEventListener('abort', () => {
        main?.destroy()
        thumbnails?.destroy()
      })
    })

    return () => {
      const { messages } = handle.props
      const hasThumbnails = items.length >= 2

      return (
        <div mix={[css(styles.articleSlider), start]}>
          <div
            data-slider="main"
            mix={css(isStarted ? styles.articleSliderMain__started : styles.articleSliderMain)}
          >
            {items.map((item, i) => (
              <div
                key={i}
                aria-hidden={item.isCopy ? 'true' : undefined}
                mix={css(
                  isStarted
                    ? styles.articleSliderMain_slide__started
                    : styles.articleSliderMain_slide
                )}
              >
                <div mix={css(styles.articleSliderMainImage)}>
                  <img
                    src={item.src}
                    alt={item.alt}
                    mix={css(styles.articleSliderMainImage_image)}
                  />
                </div>
              </div>
            ))}
          </div>

          {hasThumbnails && (
            <div
              mix={css({
                ...styles.articleSliderSub,
                ...(isStarted ? styles.articleSliderSub__started : null),
              })}
            >
              <div mix={css(styles.articleSliderSubButton)}>
                <SvgIconCircleButton
                  buttonType="button"
                  title={messages.prev}
                  icon="keyboardArrowLeft"
                  isDisabled={!isStarted}
                  mix={on('click', () => main?.prev())}
                />
              </div>
              <div data-slider="thumbnails" mix={css(styles.articleSliderSub_slider)}>
                {items.map((item, i) => (
                  <div
                    key={i}
                    mix={css(
                      isStarted
                        ? styles.articleSliderSub_slide__started
                        : styles.articleSliderSub_slide
                    )}
                  >
                    <button
                      type="button"
                      aria-label={item.thumbnailLabel}
                      aria-current={current === i ? 'true' : undefined}
                      aria-hidden={item.isCopy ? 'true' : undefined}
                      tabIndex={item.isCopy || !isStarted ? -1 : undefined}
                      mix={[
                        css({
                          ...styles.articleSliderSubImage,
                          ...(current === i ? styles.articleSliderSubImage__current : null),
                        }),
                        on('click', () => main?.moveToIdx(i)),
                      ]}
                    >
                      <span mix={css(styles.articleSliderSubImage_contents)}>
                        <img src={item.src} alt="" mix={css(styles.articleSliderSubImage_image)} />
                      </span>
                    </button>
                  </div>
                ))}
              </div>
              <div mix={css(styles.articleSliderSubButton)}>
                <SvgIconCircleButton
                  buttonType="button"
                  title={messages.next}
                  icon="keyboardArrowRight"
                  isDisabled={!isStarted}
                  mix={on('click', () => main?.next())}
                />
              </div>
            </div>
          )}
        </div>
      )
    }
  }
)
