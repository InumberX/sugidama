import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { drinkDetailFixture, drinksFixture, mockKuroco } from '../../test/kuroco.ts'
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
