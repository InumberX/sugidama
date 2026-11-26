import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { drinkDetailFixture, drinkEnFixture, drinksFixture, mockKuroco } from '../../test/kuroco.ts'
import { getDrinkDetail, getDrinks } from './drinks.ts'

const queryOf = async (
  t: Parameters<typeof mockKuroco>[0],
  options: Partial<Parameters<typeof getDrinks>[0]> = {}
) => {
  const fetch = mockKuroco(t, { '/drinks': drinksFixture([]) })
  await getDrinks({ lang: 'ja', ...options })
  return new URL(String(fetch.mock.calls[0]?.arguments[0])).searchParams
}

/** The keyword filter Kuroco is sent for `value` (already escaped). */
const keywordFilter = (value: string) =>
  `(subject contains "${value}" OR contents contains "${value}" OR manufacturer contains "${value}" OR comment contains "${value}")`

describe('getDrinks', () => {
  it('asks for the first twelve, newest first, by default', async (t) => {
    const query = await queryOf(t)

    assert.equal(query.get('cnt'), '12')
    assert.equal(query.get('pageID'), '1')
    assert.equal(query.get('order_query'), 'inst_ymdhi=DESC')
    assert.equal(query.get('filter'), null)
    assert.equal(query.get('filter_lang'), null)
  })

  it('names the language, Japanese included', async (t) => {
    assert.equal((await queryOf(t)).get('_lang'), 'ja')
    assert.equal((await queryOf(t, { lang: 'en' })).get('_lang'), 'en')
  })

  it("looks for the keyword in each text field, in the page's language", async (t) => {
    const ja = await queryOf(t, { keyword: 'x' })
    const en = await queryOf(t, { lang: 'en', keyword: 'x' })

    assert.equal(ja.get('filter'), keywordFilter('x'))
    assert.equal(ja.get('filter_lang'), 'ja')
    assert.equal(en.get('filter'), keywordFilter('x'))
    assert.equal(en.get('filter_lang'), 'en')
  })

  it('escapes quotes and backslashes in the keyword filter', async (t) => {
    const query = await queryOf(t, { keyword: 'a"b\\c' })

    assert.equal(query.get('filter'), keywordFilter('a\\"b\\\\c'))
  })

  it('ORs several categories in parentheses and ANDs them with the keyword', async (t) => {
    const one = await queryOf(t, { drinkCategoryIds: [1] })
    const many = await queryOf(t, { keyword: 'x', drinkCategoryIds: [1, 2] })

    assert.equal(one.get('filter'), 'drink_category = "1"')
    assert.equal(
      many.get('filter'),
      `${keywordFilter('x')} AND (drink_category = "1" OR drink_category = "2")`
    )
  })

  describe('a keyword and a category together, outside Japanese (issue #162)', () => {
    // Kuroco finds nothing for a text condition ANDed with drink_category when
    // filter_lang is en, so the category is matched here instead.
    const sake = (id: number) => drinkEnFixture({ topics_id: id })
    const beer = (id: number) =>
      drinkEnFixture({ topics_id: id, drink_category: { key: '1', label: 'Beer' } })
    const idsOf = (result: Awaited<ReturnType<typeof getDrinks>>) =>
      result.success ? result.data.list.map((drink) => drink.topics_id) : result.status

    it('asks Kuroco for the keyword only, and keeps the drinks of the categories', async (t) => {
      const fetch = mockKuroco(t, { '/drinks': drinksFixture([sake(1), beer(2), sake(3)]) })
      const result = await getDrinks({
        lang: 'en',
        keyword: 'x',
        drinkCategoryIds: [2],
        tags: [11],
      })
      const query = new URL(String(fetch.mock.calls[0]?.arguments[0])).searchParams

      assert.equal(query.get('filter'), keywordFilter('x'))
      assert.equal(query.get('filter_lang'), 'en')
      assert.equal(query.get('cnt'), '100')
      assert.equal(query.get('pageID'), '1')
      assert.deepEqual(query.getAll('tag_id'), ['11'])
      assert.deepEqual(idsOf(result), [1, 3])
      assert.ok(result.success)
      assert.deepEqual(result.data.pageInfo, {
        totalCnt: 2,
        perPage: 12,
        totalPageCnt: 1,
        pageNo: 1,
      })
    })

    it('reads every page Kuroco has, then cuts the page asked for', async (t) => {
      const fetch = mockKuroco(t, {
        '/drinks': {
          ...drinksFixture([sake(1), beer(2), sake(3)]),
          pageInfo: { totalCnt: 6, perPage: 100, totalPageCnt: 2, pageNo: 1 },
        },
      })
      const result = await getDrinks({
        lang: 'en',
        keyword: 'x',
        drinkCategoryIds: [1, 2],
        page: 2,
        pageSize: 4,
      })
      const pages = fetch.mock.calls.map((call) =>
        new URL(String(call.arguments[0])).searchParams.get('pageID')
      )

      assert.deepEqual(pages, ['1', '2'])
      // The mock answers every page alike: six drinks, of which four are page 1.
      assert.deepEqual(idsOf(result), [2, 3])
      assert.ok(result.success)
      assert.equal(result.data.pageInfo.totalCnt, 6)
      assert.equal(result.data.pageInfo.totalPageCnt, 2)
    })

    it('answers a page past the last with a 404, as Kuroco would', async (t) => {
      mockKuroco(t, { '/drinks': drinksFixture([beer(1)]) })

      assert.deepEqual(
        idsOf(await getDrinks({ lang: 'en', keyword: 'x', drinkCategoryIds: [2] })),
        []
      )
      assert.equal(
        idsOf(await getDrinks({ lang: 'en', keyword: 'x', drinkCategoryIds: [2], page: 2 })),
        404
      )
    })

    it("passes Kuroco's error on", async (t) => {
      mockKuroco(t, { '/drinks': new Response('error', { status: 503 }) })

      assert.equal(idsOf(await getDrinks({ lang: 'en', keyword: 'x', drinkCategoryIds: [2] })), 503)
    })

    it('leaves Japanese, and either condition alone, to Kuroco', async (t) => {
      const ja = await queryOf(t, { keyword: 'x', drinkCategoryIds: [2] })
      const category = await queryOf(t, { lang: 'en', drinkCategoryIds: [2] })

      assert.equal(ja.get('filter'), `${keywordFilter('x')} AND drink_category = "2"`)
      assert.equal(category.get('filter'), 'drink_category = "2"')
    })
  })

  it('repeats tag_id for each tag', async (t) => {
    const query = await queryOf(t, { tags: [11, 21] })

    assert.deepEqual(query.getAll('tag_id'), ['11', '21'])
  })
})

describe('getDrinkDetail', () => {
  it('asks for the drink under /drinks in the language, with the id encoded', async (t) => {
    const fetch = mockKuroco(t, { '/drinks/a%2Fb%3Fc': drinkDetailFixture() })
    const ja = await getDrinkDetail('a/b?c', 'ja')
    const en = await getDrinkDetail('a/b?c', 'en')

    assert.equal(ja.success && en.success, true)
    assert.deepEqual(
      fetch.mock.calls.map((call) => new URL(String(call.arguments[0])).search),
      ['?_lang=ja', '?_lang=en']
    )
  })

  it('answers a dot segment as a 404 without asking the API', async (t) => {
    const fetch = mockKuroco(t)

    for (const id of ['', '.', '..']) {
      const result = await getDrinkDetail(id, 'ja')
      assert.equal(result.success, false)
      assert.equal(!result.success && result.status, 404)
    }
    assert.equal(fetch.mock.calls.length, 0)
  })

  it('answers anything but a drink as a 404', async (t) => {
    const empty = (details: unknown) => ({ errors: [], messages: [], details })
    mockKuroco(t, { '/drinks/a': empty(null), '/drinks/b': empty({}), '/drinks/c': empty([]) })

    for (const id of ['a', 'b', 'c']) {
      const result = await getDrinkDetail(id, 'ja')
      assert.equal(!result.success && result.status, 404)
    }
  })
})
