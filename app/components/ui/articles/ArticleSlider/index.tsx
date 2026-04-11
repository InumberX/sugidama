import 'keen-slider/keen-slider.min.css'
import { useKeenSlider, type KeenSliderOptions } from 'keen-slider/react'
import { useState } from 'react'

import * as styles from './style.css'

import { SvgIconCircleButton } from '~/components/ui/buttons/SvgIconCircleButton'
import { BREAKPOINTS } from '~/styles/variables/breakpoints.css'

export type ArticleSliderProps = {
  className?: string
  options?: KeenSliderOptions
  thumbnailOptions?: KeenSliderOptions
  slides: {
    className?: string
    image: {
      src: string
      alt?: string
    }
  }[]
}

export const ArticleSlider = ({ className, options, thumbnailOptions, slides }: ArticleSliderProps) => {
  // 無限ループ時にスライドが4枚以下だと表示が崩れるので複製する
  const slideItems =
    slides.length <= 1
      ? slides
      : slides.length <= 2
        ? [...slides, ...slides, ...slides]
        : slides.length <= 4
          ? [...slides, ...slides]
          : slides
  const [currentSlideNumber, setCurrentSlideNumber] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isSubReady, setIsSubReady] = useState(false)
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 0,
      },
      ...options,
      created: () => {
        setIsReady(true)
      },
      slideChanged: (slider) => {
        changeSubSlide(slider.track.details.rel)
      },
    },
    []
  )
  const [sliderSubRef, instanceSubRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        origin: 'center',
        perView: 2,
        spacing: 16,
      },
      breakpoints: {
        [`(width >= ${BREAKPOINTS.sm}px)`]: {
          slides: {
            origin: 'center',
            spacing: 16,
            perView: 2,
          },
        },
        [`(width >= ${BREAKPOINTS.md}px)`]: {
          slides: {
            origin: 'center',
            spacing: 16,
            perView: 2.4,
          },
        },
        [`(width >= ${BREAKPOINTS.lg}px)`]: {
          slides: {
            origin: 'center',
            spacing: 16,
            perView: 3,
          },
        },
        [`(width >= ${BREAKPOINTS.xl}px)`]: {
          slides: {
            origin: 'center',
            spacing: 16,
            perView: 4,
          },
        },
      },
      ...thumbnailOptions,
      created: () => {
        setIsSubReady(true)
      },
      slideChanged: (slider) => {
        changeSlide(slider.track.details.rel)
      },
    },
    []
  )
  const changeSlide = (newPage: number) => {
    instanceRef.current?.moveToIdx(newPage)
    setCurrentSlideNumber(newPage)
  }
  const changeSubSlide = (newPage: number) => {
    instanceSubRef.current?.moveToIdx(newPage)
    setCurrentSlideNumber(newPage)
  }

  return (
    <div className={[styles.articleSlider, className].filter(Boolean).join(' ')}>
      <div className={styles.articleSlider_container}>
        <div
          className={[styles.articleSliderMain, isReady && styles.articleSliderMain__active].filter(Boolean).join(' ')}
        >
          <div className={styles.articleSliderMain_container}>
            <div ref={sliderRef} className={['keen-slider', styles.articleSliderMain_slider].filter(Boolean).join(' ')}>
              {slideItems.map((slide, i) => {
                return (
                  <div
                    key={i}
                    className={['keen-slider__slide', styles.articleSliderMain_slide, slide.className]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <figure className={styles.articleSliderMainImage}>
                      <img
                        src={slide.image.src}
                        alt={slide.image.alt ?? ''}
                        className={styles.articleSliderMainImage_image}
                      />
                    </figure>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {slideItems.length >= 2 && (
          <div
            className={[styles.articleSliderSub, isSubReady && styles.articleSliderSub__active]
              .filter(Boolean)
              .join(' ')}
          >
            <div className={styles.articleSliderSub_container}>
              <div
                className={[styles.articleSliderSubButton, styles.articleSliderSubButton__prev]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className={styles.articleSliderSubButton_container}>
                  <SvgIconCircleButton
                    className={[
                      styles.articleSliderSubButton_button,
                      styles['articleSliderSubButton_button__prev'],
                      !isSubReady && styles['articleSliderSubButton_button__disabled'],
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    isDisabled={!isSubReady}
                    title="前へ"
                    onClick={() => {
                      if (!isSubReady || !instanceSubRef.current) {
                        return
                      }

                      instanceSubRef.current?.prev()
                    }}
                    icon="keyboardArrowLeft"
                  />
                </div>
              </div>

              <div
                ref={sliderSubRef}
                className={['keen-slider', styles.articleSliderSub_slider].filter(Boolean).join(' ')}
              >
                {slideItems.map((slide, i) => {
                  return (
                    <div
                      key={i}
                      className={['keen-slider__slide', styles.articleSliderSub_slide, slide.className]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <button
                        type="button"
                        className={[
                          styles.articleSliderSubImage,
                          currentSlideNumber === i && styles.articleSliderSubImage__current,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => {
                          changeSubSlide(i)
                        }}
                      >
                        <span className={styles.articleSliderSubImage_contents}>
                          <img
                            src={slide.image.src}
                            alt={slide.image.alt ?? ''}
                            className={styles.articleSliderSubImage_image}
                          />
                        </span>
                      </button>
                    </div>
                  )
                })}
              </div>

              <div
                className={[styles.articleSliderSubButton, styles.articleSliderSubButton__next]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className={styles.articleSliderSubButton_container}>
                  <SvgIconCircleButton
                    className={[
                      styles.articleSliderSubButton_button,
                      styles['articleSliderSubButton_button__next'],
                      !isSubReady && styles['articleSliderSubButton_button__disabled'],
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    isDisabled={!isSubReady}
                    title="次へ"
                    onClick={() => {
                      if (!isSubReady || !instanceSubRef.current) {
                        return
                      }

                      instanceSubRef.current?.next()
                    }}
                    icon="keyboardArrowRight"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
