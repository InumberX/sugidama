import { cleanup, fireEvent, render, type RenderResult, waitFor } from '@testing-library/react'
import { useEffect } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { ArticleSlider } from '~/components/ui/articles/ArticleSlider'

type MockSliderOptions = {
  created?: () => void
  slideChanged?: (slider: { track: { details: { rel: number } } }) => void
}

type MockSliderInstance = {
  current: {
    moveToIdx: ReturnType<typeof vi.fn>
    prev: ReturnType<typeof vi.fn>
    next: ReturnType<typeof vi.fn>
  } | null
}

let sliderHookCallCount = 0
let sliderOptionsList: MockSliderOptions[] = []
let sliderInstances: MockSliderInstance[] = []

vi.mock('keen-slider/react', () => {
  return {
    useKeenSlider: (options: MockSliderOptions) => {
      const sliderIndex = sliderHookCallCount % 2
      sliderHookCallCount += 1
      const instance = sliderInstances[sliderIndex] ?? {
        current: {
          moveToIdx: vi.fn(),
          prev: vi.fn(),
          next: vi.fn(),
        },
      }

      sliderOptionsList[sliderIndex] = options
      sliderInstances[sliderIndex] = instance

      useEffect(() => {
        options.created?.()
      }, [options])

      return [vi.fn(), instance]
    },
  }
})

describe('ArticleSlider', () => {
  let result: RenderResult

  const slides = [
    {
      image: {
        src: '/images/slide-1.jpg',
        alt: 'スライド1',
      },
    },
    {
      image: {
        src: '/images/slide-2.jpg',
        alt: 'スライド2',
      },
    },
  ]

  beforeEach(() => {
    sliderHookCallCount = 0
    sliderOptionsList = []
    sliderInstances = []
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('スライドが1件の場合', () => {
      beforeEach(() => {
        result = render(
          <ArticleSlider
            slides={[
              {
                image: {
                  src: '/images/single.jpg',
                  alt: '単一スライド',
                },
              },
            ]}
          />
        )
      })

      test('メイン画像のみ表示される', () => {
        const images = result.container.querySelectorAll('img')
        expect(images).toHaveLength(1)
        expect(images[0]?.getAttribute('src')).toBe('/images/single.jpg')
        expect(images[0]?.getAttribute('alt')).toBe('単一スライド')
      })

      test('サムネイル領域と操作ボタンは表示されない', () => {
        expect(result.queryByRole('button', { name: '前へ' })).toBe(null)
        expect(result.queryByRole('button', { name: '次へ' })).toBe(null)
      })
    })

    describe('スライドが2件の場合', () => {
      beforeEach(() => {
        result = render(<ArticleSlider slides={slides} />)
      })

      test('無限ループ用にスライドが複製される', () => {
        const mainSlides = result.container.querySelectorAll('.keen-slider__slide[class*="articleSliderMain_slide"]')
        const subSlides = result.container.querySelectorAll('.keen-slider__slide[class*="articleSliderSub_slide"]')

        expect(mainSlides).toHaveLength(6)
        expect(subSlides).toHaveLength(6)
      })

      test('前へと次へボタンが表示される', () => {
        expect(result.getByRole('button', { name: '前へ' })).not.toBe(null)
        expect(result.getByRole('button', { name: '次へ' })).not.toBe(null)
      })

      test('画像の alt が正しく出力される', () => {
        const images = result.container.querySelectorAll('img[alt="スライド1"], img[alt="スライド2"]')
        expect(images.length).toBeGreaterThan(0)
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('クラス名と初期表示', () => {
      beforeEach(() => {
        result = render(<ArticleSlider slides={slides} className="custom-class" />)
      })

      test('ラッパーに articleSlider クラスとカスタムクラス名が付与される', () => {
        const wrapper = result.container.firstElementChild
        expect(wrapper?.className).toContain('articleSlider')
        expect(wrapper?.classList.contains('custom-class')).toBe(true)
      })

      test('初期状態では先頭のサムネイルが current 扱いになる', async () => {
        await waitFor(() => {
          const currentThumbnail = result.container.querySelector('button[class*="articleSliderSubImage__current"]')
          expect(currentThumbnail).not.toBe(null)
        })
      })
    })

    describe('created 後の表示状態', () => {
      beforeEach(() => {
        result = render(<ArticleSlider slides={slides} />)
      })

      test('メインとサムネイルに active クラスが付与される', async () => {
        await waitFor(() => {
          const main = result.container.querySelector('div[class*="articleSliderMain"]')
          const sub = result.container.querySelector('div[class*="articleSliderSub"]')

          expect(main?.className).toContain('articleSliderMain__active')
          expect(sub?.className).toContain('articleSliderSub__active')
        })
      })

      test('前後ボタンは有効になる', async () => {
        await waitFor(() => {
          expect(result.getByRole('button', { name: '前へ' }).hasAttribute('disabled')).toBe(false)
          expect(result.getByRole('button', { name: '次へ' }).hasAttribute('disabled')).toBe(false)
        })
      })
    })
  })

  //============================================================================
  // 3. Operation
  //============================================================================
  describe('Operation', () => {
    describe('サムネイルクリック', () => {
      beforeEach(() => {
        result = render(<ArticleSlider slides={slides} />)
      })

      test('対応するインデックスへ移動する', async () => {
        await waitFor(() => {
          expect(sliderInstances[1]?.current).not.toBe(null)
        })

        const thumbnailButtons = result.container.querySelectorAll('button[class*="articleSliderSubImage"]')
        fireEvent.click(thumbnailButtons[1] as HTMLButtonElement)

        expect(sliderInstances[1]?.current?.moveToIdx).toHaveBeenCalledWith(1)

        await waitFor(() => {
          const currentThumbnail = result.container.querySelector('button[class*="articleSliderSubImage__current"]')
          expect(currentThumbnail?.querySelector('img')?.getAttribute('alt')).toBe('スライド2')
        })
      })
    })

    describe('前へボタン', () => {
      beforeEach(() => {
        result = render(<ArticleSlider slides={slides} />)
      })

      test('サムネイルスライダーの prev が呼ばれる', async () => {
        await waitFor(() => {
          expect(result.getByRole('button', { name: '前へ' }).hasAttribute('disabled')).toBe(false)
        })

        fireEvent.click(result.getByRole('button', { name: '前へ' }))
        expect(sliderInstances[1]?.current?.prev).toHaveBeenCalledTimes(1)
      })
    })

    describe('次へボタン', () => {
      beforeEach(() => {
        result = render(<ArticleSlider slides={slides} />)
      })

      test('サムネイルスライダーの next が呼ばれる', async () => {
        await waitFor(() => {
          expect(result.getByRole('button', { name: '次へ' }).hasAttribute('disabled')).toBe(false)
        })

        fireEvent.click(result.getByRole('button', { name: '次へ' }))
        expect(sliderInstances[1]?.current?.next).toHaveBeenCalledTimes(1)
      })
    })
  })
})
