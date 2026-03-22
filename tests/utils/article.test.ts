import { describe, it, expect } from 'vitest'

import { convertDrinksToArticleCardProps } from '~/utils/article'

import type { Drink } from '~/types/api/drinks'

const createDrink = (overrides: Partial<Drink> = {}): Drink => {
  return {
    topics_id: 123,
    ymd: new Date('2024-01-15'),
    contents_type: 1,
    contents: 'contents',
    subject: 'テスト飲料',
    topics_flg: 1,
    open_flg: 1,
    regular_flg: 0,
    inst_ymdhi: new Date('2024-01-15T10:00:00+09:00'),
    update_ymdhi: new Date('2024-01-15T10:00:00+09:00'),
    topics_group_id: 1,
    post_time: '2024-01-15T10:00:00+09:00',
    slug: 'test-drink',
    ai_postprocess_state: '',
    group_nm: 'group',
    group_description: 'description',
    contents_type_cnt: 1,
    contents_type_nm: 'type',
    contents_type_slug: null,
    contents_type_parent_nm: null,
    category_parent_id: null,
    contents_type_ext_col_01: null,
    contents_type_ext_col_02: null,
    contents_type_ext_col_03: null,
    contents_type_ext_col_04: null,
    contents_type_ext_col_05: null,
    tags: [],
    contents_type_list: [1],
    description: 'description',
    thumbnail: {
      id: '1',
      url: 'https://example.com/thumb.jpg',
      desc: 'thumbnail',
      url_org: 'https://example.com/thumb_org.jpg',
    },
    main_visuals: [],
    manufacturer: 'メーカー',
    abv: 5,
    drink_category: { key: '1', label: 'ビール' },
    links: [],
    comment: 'comment',
    subject_en: 'Test Drink',
    description_en: 'description en',
    contents_en: 'contents en',
    manufacturer_en: 'Manufacturer',
    comment_en: 'comment en',
    ...overrides,
  }
}

const defaultArgs = {
  lang: 'ja',
  tags: [],
  drinkCategories: [],
}

describe('convertDrinksToArticleCardProps', () => {
  describe('url slug fallback', () => {
    it('slugが有効な文字列の場合、slugがURLに使われる', () => {
      const drink = createDrink({ slug: 'my-drink', topics_id: 456 })
      const result = convertDrinksToArticleCardProps({ ...defaultArgs, drink })

      expect(result.button?.url).toBe('/drinks/my-drink')
    })

    it('slugが空文字の場合、topics_idにフォールバックする', () => {
      const drink = createDrink({ slug: '', topics_id: 456 })
      const result = convertDrinksToArticleCardProps({ ...defaultArgs, drink })

      expect(result.button?.url).toBe('/drinks/456')
    })

    it('slugがundefinedの場合、topics_idにフォールバックする', () => {
      const drink = createDrink({ topics_id: 789 })
      // @ts-expect-error: slugにundefinedを代入してフォールバック動作をテスト
      drink.slug = undefined
      const result = convertDrinksToArticleCardProps({ ...defaultArgs, drink })

      expect(result.button?.url).toBe('/drinks/789')
    })

    it('slugがnullの場合、topics_idにフォールバックする', () => {
      const drink = createDrink({ topics_id: 101 })
      // @ts-expect-error: slugにnullを代入してフォールバック動作をテスト
      drink.slug = null
      const result = convertDrinksToArticleCardProps({ ...defaultArgs, drink })

      expect(result.button?.url).toBe('/drinks/101')
    })
  })
})
