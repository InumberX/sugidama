import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { drinkCategoriesEnFixture, drinkCategoriesFixture, mockKuroco } from '../../test/kuroco.ts'
import { getDrinkCategories, toDrinkCategoryTerms } from './drink-categories.ts'

describe('getDrinkCategories', () => {
  it('names the language, Japanese included', async (t) => {
    const fetch = mockKuroco(t)
    await getDrinkCategories('ja')
    await getDrinkCategories('en')

    assert.deepEqual(
      fetch.mock.calls.map((call) => new URL(String(call.arguments[0])).searchParams.get('_lang')),
      ['ja', 'en']
    )
  })
})

describe('toDrinkCategoryTerms', () => {
  it("sorts by the master's order and drops entries without a numeric id", () => {
    assert.deepEqual(toDrinkCategoryTerms(drinkCategoriesFixture.list), [
      { id: 1, label: 'ビール', slug: 'beer' },
      { id: 2, label: '日本酒', slug: 'sake' },
    ])
  })

  it('labels each entry with its name, and leaves the input unsorted', () => {
    const items = [...drinkCategoriesEnFixture.list]
    const terms = toDrinkCategoryTerms(items)

    assert.deepEqual(
      terms.map((term) => term.label),
      ['Beer', 'Sake']
    )
    assert.deepEqual(items, drinkCategoriesEnFixture.list)
  })

  it('drops an entry without a slug, since its image is named after it', () => {
    const terms = toDrinkCategoryTerms([
      { id: '3', order: '1', name: 'ジン', slug: '' },
      // The API is untyped JSON; a missing slug must not become `img-category-undefined`.
      { id: '4', order: '2', name: 'ラム', slug: null as unknown as string },
    ])
    assert.deepEqual(terms, [])
  })
})
