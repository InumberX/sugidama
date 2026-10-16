// Shared fixtures for anything that reaches the Kuroco API. Tests never touch
// the network: `mockKuroco(t)` replaces the global `fetch` for one test (the
// test context restores it), answering each endpoint with the fixtures below
// unless an override says otherwise.
import type { TestContext } from 'remix/test'

import type { DrinkCategories } from '../app/data/drink-categories.types.ts'
import type { Drink, Drinks } from '../app/data/drinks.types.ts'
import type { Tags } from '../app/data/tags.types.ts'

export const drinkCategoriesFixture: DrinkCategories = {
  errors: [],
  messages: [],
  // Out of order on purpose: the master's `order` decides.
  list: [
    { id: '2', order: '2', name: '日本酒', name_en: 'Sake', slug: 'sake' },
    { id: '1', order: '1', name: 'ビール', name_en: 'Beer', slug: 'beer' },
    { id: 'x', order: '3', name: '壊れた項目', name_en: 'Broken', slug: 'broken' },
  ],
}

const tagsOf = (id: number, ja: string, en: string): Tags => ({
  errors: [],
  messages: [],
  list: [
    {
      tag_category_id: 1,
      tag_category_nm: 'category',
      tags: { [String(id)]: { tag_id: id, tag_nm: ja, ext_col_01: en } },
    },
  ],
})

export const tasteTagsFixture = tagsOf(11, '辛口', 'Dry')
export const drinkabilityTagsFixture = tagsOf(21, '飲みやすい', 'Easy')

export const drinkFixture = (overrides: Partial<Drink> = {}): Drink => ({
  topics_id: 100,
  slug: 'kubota',
  subject: '久保田',
  subject_en: 'Kubota',
  inst_ymdhi: '2024-03-01T23:30:00+09:00',
  update_ymdhi: '2024-03-01T23:30:00+09:00',
  description: '',
  description_en: '',
  contents: '',
  contents_en: '',
  thumbnail: { id: 'img', url: 'https://example.com/kubota.webp', desc: '久保田の瓶', url_org: '' },
  main_visuals: [],
  manufacturer: '朝日酒造',
  manufacturer_en: 'Asahi Shuzo',
  abv: 15,
  drink_category: { key: '2', label: '日本酒' },
  tags: [{ tag_id: 11, tag_nm: '辛口' }],
  links: [],
  comment: '',
  comment_en: '',
  ...overrides,
})

export const drinksFixture = (list: Drink[]): Drinks => ({
  errors: [],
  messages: [],
  list,
  pageInfo: { totalCnt: list.length, perPage: 12, totalPageCnt: 1, pageNo: 1 },
})

/** Six drinks, newest first: two large cards and four compact ones on the home page. */
export const newArrivalsFixture = drinksFixture(
  Array.from({ length: 6 }, (_, i) =>
    drinkFixture({ topics_id: 100 + i, slug: `drink-${i}`, subject: `お酒${i}`, subject_en: `Drink ${i}` })
  )
)

/** What an endpoint answers: a body to send as JSON, a ready Response, or an Error to throw. */
export type KurocoAnswer = unknown | Response | Error

const DEFAULT_ANSWERS: Record<string, KurocoAnswer> = {
  '/drinks': newArrivalsFixture,
  '/masters/drink_category': drinkCategoriesFixture,
  '/tags/taste': tasteTagsFixture,
  '/tags/drinkability': drinkabilityTagsFixture,
}

/**
 * Replaces `fetch` for this test. Endpoints are matched by the end of the
 * URL's path, so the API base in `API_URL` does not matter. Returns the mock,
 * whose `calls` record each requested URL.
 */
export const mockKuroco = (t: TestContext, overrides: Record<string, KurocoAnswer> = {}) => {
  const answers = { ...DEFAULT_ANSWERS, ...overrides }

  return t.mock.method(globalThis, 'fetch', async (input: RequestInfo | URL) => {
    const url = new URL(input instanceof Request ? input.url : String(input))
    const endpoint = Object.keys(answers).find((path) => url.pathname.endsWith(path))
    if (endpoint === undefined) throw new Error(`unmocked Kuroco request: ${url}`)

    const answer = answers[endpoint]
    if (answer instanceof Error) throw answer
    if (answer instanceof Response) return answer.clone()
    return Response.json(answer)
  })
}
