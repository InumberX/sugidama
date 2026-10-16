import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import {
  countDrinkPages,
  type DrinkSearch,
  normalizeSearchKeyword,
  parseDrinkSearch,
  toDrinkSearchListHref,
} from './drink-search.ts'

const EMPTY: DrinkSearch = { keyword: '', page: 1, drink: [], taste: [], drinkability: [] }

describe('normalizeSearchKeyword', () => {
  it('trims and turns full-width spaces into ASCII ones', () => {
    assert.equal(normalizeSearchKeyword('　辛口　日本酒 '), '辛口 日本酒')
    assert.equal(normalizeSearchKeyword(null), '')
  })
})

describe('parseDrinkSearch', () => {
  it('reads every condition and defaults to the first page', () => {
    const search = parseDrinkSearch(
      new URLSearchParams('keyword=+%E8%BE%9B+&drink=2&drink=1&taste=11&drinkability=21')
    )

    assert.deepEqual(search, {
      keyword: '辛',
      page: 1,
      drink: [2, 1],
      taste: [11],
      drinkability: [21],
    })
  })

  it('drops ids that are not integers', () => {
    const search = parseDrinkSearch(new URLSearchParams('drink=abc&drink=3&taste='))

    assert.deepEqual(search?.drink, [3])
    assert.deepEqual(search?.taste, [])
  })

  it('drops ids that only start like one, and any that is not a positive safe integer', () => {
    const values = ['2abc', '1.9', '-5', '1e3', '0', '99999999999999999999', ' 4']
    const search = parseDrinkSearch(new URLSearchParams(values.map((v) => ['drink', v])))

    assert.deepEqual(search?.drink, [])
  })

  it('collapses repeated ids', () => {
    assert.deepEqual(
      parseDrinkSearch(new URLSearchParams('taste=11&taste=11&taste=12'))?.taste,
      [11, 12]
    )
  })

  it('accepts a positive page and rejects anything else', () => {
    assert.equal(parseDrinkSearch(new URLSearchParams('page=3'))?.page, 3)
    for (const page of ['0', '-1', '1.5', 'abc', '', '99999999999999999999']) {
      assert.equal(parseDrinkSearch(new URLSearchParams({ page })), null, `page=${page}`)
    }
  })
})

describe('toDrinkSearchListHref', () => {
  it('is the bare list URL for the first page of an empty search', () => {
    assert.equal(toDrinkSearchListHref('ja', EMPTY, 1), '/drinks')
    assert.equal(toDrinkSearchListHref('en', EMPTY, 1), '/en/drinks')
  })

  it('carries the conditions and any later page', () => {
    const search = { ...EMPTY, keyword: '辛', drink: [2], taste: [11, 12] }

    assert.equal(
      toDrinkSearchListHref('ja', search, 2),
      '/drinks?keyword=%E8%BE%9B&drink=2&taste=11&taste=12&page=2'
    )
  })

  it('round-trips through parseDrinkSearch', () => {
    const search = { keyword: 'a b', page: 4, drink: [1], taste: [], drinkability: [21] }
    const href = toDrinkSearchListHref('ja', search, search.page)

    assert.deepEqual(parseDrinkSearch(new URL(href, 'http://localhost').searchParams), search)
  })
})

describe('countDrinkPages', () => {
  it('rounds up, and is at least one page', () => {
    assert.equal(countDrinkPages(0), 1)
    assert.equal(countDrinkPages(12), 1)
    assert.equal(countDrinkPages(13), 2)
  })
})
