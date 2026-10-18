import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import {
  countDrinkPages,
  type DrinkSearch,
  normalizeSearchKeyword,
  parseDrinkSearch,
  toDrinkSearchListHref,
  toDrinkSearchRedirectHref,
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
      ignored: false,
      search: {
        keyword: '辛',
        page: 1,
        drink: [2, 1],
        taste: [11],
        drinkability: [21],
      },
    })
  })

  it('ignores any id that is not a canonical positive integer', () => {
    for (const value of [
      'abc',
      '',
      '2abc',
      '1.9',
      '-5',
      '1e3',
      '0',
      '02',
      ' 4',
      '99999999999999999999',
    ]) {
      assert.deepEqual(
        parseDrinkSearch(
          new URLSearchParams([
            ['drink', value],
            ['drink', '3'],
          ])
        ),
        { search: { ...EMPTY, drink: [3] }, ignored: true },
        `drink=${value}`
      )
    }
  })

  it('ignores ids past the cap and rejects a longer keyword than any form can submit', () => {
    const many = new URLSearchParams(Array.from({ length: 51 }, (_, i) => ['taste', String(i + 1)]))
    const parsed = parseDrinkSearch(many)
    assert.equal(parsed?.search.taste.length, 50)
    assert.equal(parsed?.ignored, true)
    assert.equal(parseDrinkSearch(new URLSearchParams({ keyword: 'あ'.repeat(101) })), null)
    assert.equal(
      parseDrinkSearch(new URLSearchParams({ keyword: 'あ'.repeat(100) }))?.search.keyword.length,
      100
    )
  })

  it('collapses repeated ids, and says so', () => {
    assert.deepEqual(parseDrinkSearch(new URLSearchParams('taste=11&taste=11&taste=12')), {
      search: { ...EMPTY, taste: [11, 12] },
      ignored: true,
    })
    assert.equal(parseDrinkSearch(new URLSearchParams('taste=11&taste=12'))?.ignored, false)
  })

  it('accepts a positive page and rejects anything else', () => {
    assert.equal(parseDrinkSearch(new URLSearchParams('page=3'))?.search.page, 3)
    assert.equal(parseDrinkSearch(new URLSearchParams('page=02')), null)
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

    assert.deepEqual(parseDrinkSearch(new URL(href, 'http://localhost').searchParams), {
      search,
      ignored: false,
    })
  })
})

describe('countDrinkPages', () => {
  it('rounds up, and is at least one page', () => {
    assert.equal(countDrinkPages(0), 1)
    assert.equal(countDrinkPages(12), 1)
    assert.equal(countDrinkPages(13), 2)
  })
})

describe('toDrinkSearchRedirectHref', () => {
  it('keeps the parameters the list does not read', () => {
    const search = { ...EMPTY, taste: [11], page: 2 }
    const original = new URLSearchParams('utm_source=x&taste=02&taste=11&page=2&utm_medium=y')

    assert.equal(
      toDrinkSearchRedirectHref('ja', search, original),
      '/drinks?taste=11&page=2&utm_source=x&utm_medium=y'
    )
    assert.equal(
      toDrinkSearchRedirectHref('en', EMPTY, new URLSearchParams('utm_source=x&drink=0')),
      '/en/drinks?utm_source=x'
    )
  })
})
