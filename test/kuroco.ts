// Shared fixtures for anything that reaches the Kuroco API. Tests never touch
// the network: `mockKuroco(t)` replaces the global `fetch` for one test (the
// test context restores it), answering each endpoint with the fixtures below
// unless an override says otherwise.
//
// Kuroco keeps each language as a version of the same record, under the same
// field names, and answers the one `_lang` asks for. So each fixture comes in
// Japanese and, where a test needs it, English (`…EnFixture`), and the default
// answers pick one by the request's `_lang`.
import type { TestContext } from 'remix/test'

import type { DrinkCategories } from '../app/data/drink-categories.types.ts'
import type { Drink, DrinkDetail, Drinks } from '../app/data/drinks.types.ts'
import type { Tags } from '../app/data/tags.types.ts'
import { API_URL } from '../app/env.ts'
import { LANGS, type Lang } from '../app/utils/i18n.ts'

export const drinkCategoriesFixture: DrinkCategories = {
  errors: [],
  messages: [],
  // Out of order on purpose: the master's `order` decides.
  list: [
    { id: '2', order: '2', name: '日本酒', slug: 'sake' },
    { id: '1', order: '1', name: 'ビール', slug: 'beer' },
    { id: 'x', order: '3', name: '壊れた項目', slug: 'broken' },
  ],
}

export const drinkCategoriesEnFixture: DrinkCategories = {
  ...drinkCategoriesFixture,
  list: [
    { id: '2', order: '2', name: 'Sake', slug: 'sake' },
    { id: '1', order: '1', name: 'Beer', slug: 'beer' },
    { id: 'x', order: '3', name: 'Broken', slug: 'broken' },
  ],
}

/**
 * A tag group of one tag, as the tags are kept: the title (`tag_nm`) is the
 * name shown, and a label (`ext_col_01`) is set only for a name a title cannot
 * hold, such as one with a space.
 */
const tagsOf = (id: number, tagName: string, label = ''): Tags => ({
  errors: [],
  messages: [],
  list: [
    {
      tag_category_id: 1,
      tag_category_nm: 'category',
      tags: { [String(id)]: { tag_id: id, tag_nm: tagName, ext_col_01: label } },
    },
  ],
})

export const tasteTagsFixture = tagsOf(11, '辛口')
export const tasteTagsEnFixture = tagsOf(11, 'Dry')
export const drinkabilityTagsFixture = tagsOf(21, '飲みやすい')
export const drinkabilityTagsEnFixture = tagsOf(21, 'easy_to_drink', 'Easy to drink')

export const drinkFixture = (overrides: Partial<Drink> = {}): Drink => ({
  topics_id: 100,
  slug: 'kubota',
  subject: '久保田',
  inst_ymdhi: '2024-03-01T23:30:00+09:00',
  update_ymdhi: '2024-03-01T23:30:00+09:00',
  description: '',
  contents: '',
  thumbnail: { id: 'img', url: 'https://example.com/kubota.webp', desc: '久保田の瓶', url_org: '' },
  main_visuals: [],
  manufacturer: '朝日酒造',
  abv: 15,
  drink_category: { key: '2', label: '日本酒' },
  tags: [{ tag_id: 11, tag_nm: '辛口' }],
  links: [],
  comment: '',
  ...overrides,
})

/** `drinkFixture`'s English version: the same drink, its text in English. */
export const drinkEnFixture = (overrides: Partial<Drink> = {}): Drink =>
  drinkFixture({
    subject: 'Kubota',
    thumbnail: {
      id: 'img',
      url: 'https://example.com/kubota.webp',
      desc: 'A bottle of Kubota',
      url_org: '',
    },
    manufacturer: 'Asahi Shuzo',
    drink_category: { key: '2', label: 'Sake' },
    ...overrides,
  })

export const drinksFixture = (list: Drink[]): Drinks => ({
  errors: [],
  messages: [],
  list,
  pageInfo: { totalCnt: list.length, perPage: 12, totalPageCnt: 1, pageNo: 1 },
})

/** `/drinks/<slug>`'s answer; mock it under that path (`'/drinks/kubota'`). */
export const drinkDetailFixture = (drink: Drink = drinkFixture()): DrinkDetail => ({
  errors: [],
  messages: [],
  details: drink,
})

/** Six drinks, newest first: two large cards and four compact ones on the home page. */
const newArrivalsOf = (toDrink: typeof drinkFixture, subject: (i: number) => string): Drinks =>
  drinksFixture(
    Array.from({ length: 6 }, (_, i) =>
      toDrink({ topics_id: 100 + i, slug: `drink-${i}`, subject: subject(i) })
    )
  )

export const newArrivalsFixture = newArrivalsOf(drinkFixture, (i) => `お酒${i}`)
export const newArrivalsEnFixture = newArrivalsOf(drinkEnFixture, (i) => `Drink ${i}`)

/** What an endpoint answers: a body to send as JSON, a ready Response, or an Error to throw. */
export type KurocoAnswer = unknown | Response | Error

/** One answer per language, picked by the request's `_lang`; made with `byLang()`. */
class LangAnswers {
  constructor(readonly answers: Record<Lang, KurocoAnswer>) {}
}

/** An endpoint that answers each language differently. A plain answer is the same in both. */
export const byLang = (answers: Record<Lang, KurocoAnswer>): LangAnswers => new LangAnswers(answers)

const DEFAULT_ANSWERS: Record<string, KurocoAnswer> = {
  '/drinks': byLang({ ja: newArrivalsFixture, en: newArrivalsEnFixture }),
  '/masters/drink_category': byLang({ ja: drinkCategoriesFixture, en: drinkCategoriesEnFixture }),
  '/tags/taste': byLang({ ja: tasteTagsFixture, en: tasteTagsEnFixture }),
  '/tags/drinkability': byLang({ ja: drinkabilityTagsFixture, en: drinkabilityTagsEnFixture }),
}

const isLang = (value: string | null): value is Lang => LANGS.some((lang) => lang === value)

/**
 * Replaces `fetch` for this test. Endpoints are matched exactly, as the path
 * under `API_URL`, so a new endpoint that merely ends the same way fails as
 * unmocked instead of getting the wrong fixture. A request without a `_lang`
 * fails too: Kuroco would pick its language from `Accept-Language`, and the
 * Workers cache would keep that answer for the other language. Returns the
 * mock, whose `calls` record each requested URL.
 */
const API_BASE_PATH = new URL(API_URL).pathname

export const mockKuroco = (t: TestContext, overrides: Record<string, KurocoAnswer> = {}) => {
  const answers = { ...DEFAULT_ANSWERS, ...overrides }

  return t.mock.method(globalThis, 'fetch', async (input: RequestInfo | URL) => {
    const url = new URL(input instanceof Request ? input.url : String(input))
    const path = url.pathname.startsWith(API_BASE_PATH)
      ? url.pathname.slice(API_BASE_PATH.length)
      : url.pathname
    if (!Object.hasOwn(answers, path)) throw new Error(`unmocked Kuroco request: ${url}`)
    const lang = url.searchParams.get('_lang')
    if (!isLang(lang)) throw new Error(`Kuroco request without a known _lang: ${url}`)

    const entry = answers[path]
    const answer = entry instanceof LangAnswers ? entry.answers[lang] : entry
    if (answer instanceof Error) throw answer
    // A fresh Response rather than `answer.clone()`: a clone tees the body, and
    // cancelling one branch of a tee waits for the other, so the API client's
    // `body.cancel()` on an error status would never settle.
    if (answer instanceof Response) {
      const { status, statusText, headers } = answer
      // A null-body status (204, 205, 304) rejects any body, an empty one included.
      const body = [204, 205, 304].includes(status) ? null : await answer.clone().arrayBuffer()
      return new Response(body, { status, statusText, headers })
    }
    return Response.json(answer)
  })
}

/**
 * Installs a Workers-style `caches.default` for this test, backed by a Map, and
 * removes it when the test ends (Node has no `caches`). Returns the store, keyed
 * by cache URL, and the mocks whose `calls` record each `match` and `put`.
 */
export const mockApiCache = (t: TestContext) => {
  const store = new Map<string, { body: string; headers: Headers }>()
  const match = t.mock.fn(async (key: RequestInfo | URL) => {
    const entry = store.get(String(key))
    return entry ? new Response(entry.body, { headers: entry.headers }) : undefined
  })
  const put = t.mock.fn(async (key: RequestInfo | URL, response: Response) => {
    store.set(String(key), { body: await response.text(), headers: response.headers })
  })
  const global = globalThis as { caches?: unknown }
  global.caches = { default: { match, put } }
  t.after(() => {
    delete global.caches
  })
  return { store, match, put }
}
