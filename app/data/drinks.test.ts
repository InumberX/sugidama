import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { drinksFixture, mockKuroco } from '../../test/kuroco.ts'
import { getDrinks } from './drinks.ts'

const queryOf = async (
  t: Parameters<typeof mockKuroco>[0],
  options?: Parameters<typeof getDrinks>[0]
) => {
  const fetch = mockKuroco(t, { '/drinks': drinksFixture([]) })
  await getDrinks(options)
  return new URL(String(fetch.mock.calls[0]?.arguments[0])).searchParams
}

describe('getDrinks', () => {
  it('asks for the first twelve, newest first, by default', async (t) => {
    const query = await queryOf(t)

    assert.equal(query.get('cnt'), '12')
    assert.equal(query.get('pageID'), '1')
    assert.equal(query.get('order_query'), 'inst_ymdhi=DESC')
    assert.equal(query.get('filter'), null)
  })

  it('escapes quotes and backslashes in the keyword filter', async (t) => {
    const query = await queryOf(t, { keyword: 'a"b\\c' })

    assert.equal(query.get('filter'), 'keyword contains "a\\"b\\\\c"')
  })

  it('ORs several categories in parentheses and ANDs them with the keyword', async (t) => {
    const one = await queryOf(t, { drinkCategoryIds: [1] })
    const many = await queryOf(t, { keyword: 'x', drinkCategoryIds: [1, 2] })

    assert.equal(one.get('filter'), 'drink_category = "1"')
    assert.equal(
      many.get('filter'),
      'keyword contains "x" AND (drink_category = "1" OR drink_category = "2")'
    )
  })

  it('repeats tag_id for each tag', async (t) => {
    const query = await queryOf(t, { tags: [11, 21] })

    assert.deepEqual(query.getAll('tag_id'), ['11', '21'])
  })
})
