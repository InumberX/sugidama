import { describe, it, expect } from 'vitest'

import type { Drink } from '~/types/api/drinks'
import { convertDrinkToArticleCardProps, convertDrinkToBaseArticleProps } from '~/utils/article'

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

describe('convertDrinkToArticleCardProps', () => {
  describe('url slug fallback', () => {
    it('slugが有効な文字列の場合、slugがURLに使われる', () => {
      const drink = createDrink({ slug: 'my-drink', topics_id: 456 })
      const result = convertDrinkToArticleCardProps({ ...defaultArgs, drink })

      expect(result.button?.url).toBe('/drinks/my-drink')
    })

    it('slugが空文字の場合、topics_idにフォールバックする', () => {
      const drink = createDrink({ slug: '', topics_id: 456 })
      const result = convertDrinkToArticleCardProps({ ...defaultArgs, drink })

      expect(result.button?.url).toBe('/drinks/456')
    })

    it('slugがundefinedの場合、topics_idにフォールバックする', () => {
      const drink = createDrink({ topics_id: 789 })
      // @ts-expect-error: slugにundefinedを代入してフォールバック動作をテスト
      drink.slug = undefined
      const result = convertDrinkToArticleCardProps({ ...defaultArgs, drink })

      expect(result.button?.url).toBe('/drinks/789')
    })

    it('slugがnullの場合、topics_idにフォールバックする', () => {
      const drink = createDrink({ topics_id: 101 })
      // @ts-expect-error: slugにnullを代入してフォールバック動作をテスト
      drink.slug = null
      const result = convertDrinkToArticleCardProps({ ...defaultArgs, drink })

      expect(result.button?.url).toBe('/drinks/101')
    })
  })

  describe('title', () => {
    it('lang=jaの場合、subjectがタイトルに使われる', () => {
      const drink = createDrink({ subject: '日本語タイトル', subject_en: 'English Title' })
      const result = convertDrinkToArticleCardProps({ ...defaultArgs, lang: 'ja', drink })

      expect(result.title.text).toBe('日本語タイトル')
    })

    it('lang=enの場合、subject_enがタイトルに使われる', () => {
      const drink = createDrink({ subject: '日本語タイトル', subject_en: 'English Title' })
      const result = convertDrinkToArticleCardProps({ ...defaultArgs, lang: 'en', drink })

      expect(result.title.text).toBe('English Title')
    })
  })

  describe('description（日付フォーマット）', () => {
    it('lang=jaの場合、yyyy/MM/dd形式で出力される', () => {
      const drink = createDrink({ inst_ymdhi: new Date('2024-03-15T10:00:00+09:00') })
      const result = convertDrinkToArticleCardProps({ ...defaultArgs, lang: 'ja', drink })

      expect(result.description?.text).toBe('2024/03/15')
    })

    it('lang=enの場合、MMMM d, yyyy形式で出力される', () => {
      const drink = createDrink({ inst_ymdhi: new Date('2024-03-15T10:00:00+09:00') })
      const result = convertDrinkToArticleCardProps({ ...defaultArgs, lang: 'en', drink })

      expect(result.description?.text).toBe('March 15, 2024')
    })
  })

  describe('thumbnail', () => {
    it('thumbnailがある場合、src/altが設定される', () => {
      const drink = createDrink({
        thumbnail: {
          id: '1',
          url: 'https://example.com/img.jpg',
          desc: '説明',
          url_org: 'https://example.com/img_org.jpg',
        },
      })
      const result = convertDrinkToArticleCardProps({ ...defaultArgs, drink })

      expect(result.thumbnail).toEqual({ src: 'https://example.com/img.jpg', alt: '説明' })
    })
  })

  describe('url（言語プレフィックス）', () => {
    it('lang=enの場合、URLに/enプレフィックスが付く', () => {
      const drink = createDrink({ slug: 'my-drink' })
      const result = convertDrinkToArticleCardProps({ ...defaultArgs, lang: 'en', drink })

      expect(result.button?.url).toBe('/en/drinks/my-drink')
    })
  })

  describe('tags', () => {
    it('drinkCategoriesに一致するカテゴリがある場合、タグに含まれる', () => {
      const drink = createDrink({ drink_category: { key: '1', label: 'ビール' } })
      const result = convertDrinkToArticleCardProps({
        ...defaultArgs,
        drink,
        drinkCategories: [{ id: 1, label: 'ビール' }],
      })

      expect(result.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ children: 'ビール', url: expect.stringContaining('drink=1') }),
        ])
      )
    })

    it('drinkCategoriesに一致するカテゴリがない場合、カテゴリタグは含まれない', () => {
      const drink = createDrink({ drink_category: { key: '99', label: '不明' } })
      const result = convertDrinkToArticleCardProps({
        ...defaultArgs,
        drink,
        drinkCategories: [{ id: 1, label: 'ビール' }],
      })

      expect(result.tags?.filter((t) => t.children === 'ビール')).toHaveLength(0)
    })

    it('tagsとdrink.tagsに一致するものがある場合、タグに含まれる', () => {
      const drink = createDrink({
        tags: [
          {
            tag_id: 10,
            tag_nm: '辛口',
            ext_col_01: 'Dry',
            tag_category_id: 1,
            weight: 0,
            ext_col_02: '',
            ext_col_03: '',
            ext_col_04: '',
            ext_col_05: '',
            ext_col_06: '',
            ext_col_07: '',
            ext_col_08: '',
            ext_col_09: '',
            ext_col_10: '',
            open_contents_cnt: 0,
            all_contents_cnt: 0,
            inst_ymdhi: new Date('2024-01-15T10:00:00+09:00'),
            update_ymdhi: new Date('2024-01-15T10:00:00+09:00'),
          },
        ],
      })
      const result = convertDrinkToArticleCardProps({
        ...defaultArgs,
        drink,
        tags: [{ name: 'taste', items: [{ id: 10, label: '辛口' }] }],
      })

      expect(result.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ children: '辛口', url: expect.stringContaining('taste=10') }),
        ])
      )
    })

    it('drink.tagsが空の場合、タグ由来のタグは含まれない', () => {
      const drink = createDrink({ tags: [] })
      const result = convertDrinkToArticleCardProps({
        ...defaultArgs,
        drink,
        tags: [{ name: 'taste', items: [{ id: 10, label: '辛口' }] }],
      })

      expect(result.tags).toEqual([])
    })
  })
})

describe('convertDrinkToBaseArticleProps', () => {
  describe('title', () => {
    it('lang=jaの場合、subjectがタイトルに使われる', () => {
      const drink = createDrink({ subject: '日本酒A', subject_en: 'Sake A' })
      const result = convertDrinkToBaseArticleProps({ ...defaultArgs, lang: 'ja', drink })

      expect(result.title.text).toBe('日本酒A')
    })

    it('lang=enの場合、subject_enがタイトルに使われる', () => {
      const drink = createDrink({ subject: '日本酒A', subject_en: 'Sake A' })
      const result = convertDrinkToBaseArticleProps({ ...defaultArgs, lang: 'en', drink })

      expect(result.title.text).toBe('Sake A')
    })
  })

  describe('mainVisuals', () => {
    it('main_visualsがある場合、src/altが設定される', () => {
      const drink = createDrink({
        main_visuals: [
          {
            main_visual_image: { id: '1', url: 'https://example.com/mv1.jpg', desc: '', url_org: '' },
            main_visual_title: 'メイン画像1',
            main_visual_title_en: 'Main Visual 1',
          },
          {
            main_visual_image: { id: '2', url: 'https://example.com/mv2.jpg', desc: '', url_org: '' },
            main_visual_title: 'メイン画像2',
            main_visual_title_en: 'Main Visual 2',
          },
        ],
      })
      const result = convertDrinkToBaseArticleProps({ ...defaultArgs, lang: 'ja', drink })

      expect(result.mainVisuals).toEqual([
        { src: 'https://example.com/mv1.jpg', alt: 'メイン画像1' },
        { src: 'https://example.com/mv2.jpg', alt: 'メイン画像2' },
      ])
    })

    it('lang=enの場合、altにmain_visual_title_enが使われる', () => {
      const drink = createDrink({
        main_visuals: [
          {
            main_visual_image: { id: '1', url: 'https://example.com/mv1.jpg', desc: '', url_org: '' },
            main_visual_title: 'メイン画像1',
            main_visual_title_en: 'Main Visual 1',
          },
        ],
      })
      const result = convertDrinkToBaseArticleProps({ ...defaultArgs, lang: 'en', drink })

      expect(result.mainVisuals).toEqual([{ src: 'https://example.com/mv1.jpg', alt: 'Main Visual 1' }])
    })

    it('main_visualsが空の場合、空配列になる', () => {
      const drink = createDrink({ main_visuals: [] })
      const result = convertDrinkToBaseArticleProps({ ...defaultArgs, drink })

      expect(result.mainVisuals).toEqual([])
    })
  })

  describe('info', () => {
    it('drinkCategoryに一致するカテゴリがある場合、種類が含まれる', () => {
      const drink = createDrink({ drink_category: { key: '1', label: 'ビール' } })
      const result = convertDrinkToBaseArticleProps({
        ...defaultArgs,
        lang: 'ja',
        drink,
        drinkCategories: [{ id: 1, label: 'ビール' }],
      })

      expect(result.info?.items).toEqual(
        expect.arrayContaining([expect.objectContaining({ title: '種類', text: 'ビール' })])
      )
    })

    it('lang=enの場合、種類のタイトルがCategoryになる', () => {
      const drink = createDrink({ drink_category: { key: '1', label: 'Beer' } })
      const result = convertDrinkToBaseArticleProps({
        ...defaultArgs,
        lang: 'en',
        drink,
        drinkCategories: [{ id: 1, label: 'Beer' }],
      })

      expect(result.info?.items).toEqual(
        expect.arrayContaining([expect.objectContaining({ title: 'Category', text: 'Beer' })])
      )
    })

    it('drinkCategoryに一致しない場合、種類が含まれない', () => {
      const drink = createDrink({ drink_category: { key: '99', label: '不明' } })
      const result = convertDrinkToBaseArticleProps({
        ...defaultArgs,
        drink,
        drinkCategories: [{ id: 1, label: 'ビール' }],
      })

      expect(result.info?.items?.filter((item) => item.title === '種類')).toHaveLength(0)
    })

    it('commentがある場合、コメントが含まれる', () => {
      const drink = createDrink({ comment: 'とても美味しい' })
      const result = convertDrinkToBaseArticleProps({ ...defaultArgs, lang: 'ja', drink })

      expect(result.info?.items).toEqual(
        expect.arrayContaining([expect.objectContaining({ title: 'コメント', text: 'とても美味しい' })])
      )
    })

    it('lang=enの場合、commentのタイトルがCommentになりcomment_enが使われる', () => {
      const drink = createDrink({ comment: 'とても美味しい', comment_en: 'Very tasty' })
      const result = convertDrinkToBaseArticleProps({ ...defaultArgs, lang: 'en', drink })

      expect(result.info?.items).toEqual(
        expect.arrayContaining([expect.objectContaining({ title: 'Comment', text: 'Very tasty' })])
      )
    })

    it('commentが空文字の場合、コメントが含まれない', () => {
      const drink = createDrink({ comment: '' })
      const result = convertDrinkToBaseArticleProps({ ...defaultArgs, lang: 'ja', drink })

      expect(result.info?.items?.filter((item) => item.title === 'コメント')).toHaveLength(0)
    })

    it('linksがある場合、リンク情報が含まれる', () => {
      const drink = createDrink({
        links: [{ link_text: 'リンク1', link_text_en: 'Link 1', link_url: 'https://example.com', link_url_en: '' }],
      })
      const result = convertDrinkToBaseArticleProps({ ...defaultArgs, lang: 'ja', drink })

      const linksItem = result.info?.items?.find((item) => item.title === 'リンク')
      expect(linksItem).not.toBe(undefined)
    })

    it('lang=enの場合、リンクのタイトルがLinksになりlink_text_enが使われる', () => {
      const drink = createDrink({
        links: [{ link_text: 'リンク1', link_text_en: 'Link 1', link_url: 'https://example.com', link_url_en: '' }],
      })
      const result = convertDrinkToBaseArticleProps({ ...defaultArgs, lang: 'en', drink })

      const linksItem = result.info?.items?.find((item) => item.title === 'Links')
      expect(linksItem).not.toBe(undefined)
    })

    it('linksが空の場合、リンク情報が含まれない', () => {
      const drink = createDrink({ links: [] })
      const result = convertDrinkToBaseArticleProps({ ...defaultArgs, lang: 'ja', drink })

      expect(result.info?.items?.filter((item) => item.title === 'リンク')).toHaveLength(0)
    })
  })

  describe('tags', () => {
    it('drinkCategoriesに一致するカテゴリがある場合、タグに含まれる', () => {
      const drink = createDrink({ drink_category: { key: '1', label: 'ビール' } })
      const result = convertDrinkToBaseArticleProps({
        ...defaultArgs,
        drink,
        drinkCategories: [{ id: 1, label: 'ビール' }],
      })

      expect(result.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ children: 'ビール', url: expect.stringContaining('drink=1') }),
        ])
      )
    })

    it('tagsとdrink.tagsに一致するものがある場合、タグに含まれる', () => {
      const drink = createDrink({
        tags: [
          {
            tag_id: 10,
            tag_nm: '辛口',
            ext_col_01: 'Dry',
            tag_category_id: 1,
            weight: 0,
            ext_col_02: '',
            ext_col_03: '',
            ext_col_04: '',
            ext_col_05: '',
            ext_col_06: '',
            ext_col_07: '',
            ext_col_08: '',
            ext_col_09: '',
            ext_col_10: '',
            open_contents_cnt: 0,
            all_contents_cnt: 0,
            inst_ymdhi: new Date('2024-01-15T10:00:00+09:00'),
            update_ymdhi: new Date('2024-01-15T10:00:00+09:00'),
          },
        ],
      })
      const result = convertDrinkToBaseArticleProps({
        ...defaultArgs,
        drink,
        tags: [{ name: 'taste', items: [{ id: 10, label: '辛口' }] }],
      })

      expect(result.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ children: '辛口', url: expect.stringContaining('taste=10') }),
        ])
      )
    })

    it('drink.tagsが空の場合、タグ由来のタグは含まれない', () => {
      const drink = createDrink({ tags: [] })
      const result = convertDrinkToBaseArticleProps({
        ...defaultArgs,
        drink,
        drinkCategories: [],
        tags: [{ name: 'taste', items: [{ id: 10, label: '辛口' }] }],
      })

      expect(result.tags).toEqual([])
    })
  })
})
