import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { drinkCategoriesFixture, tasteTagsFixture } from '../../test/kuroco.ts'
import { toDrinkCategoryTerms } from './drink-categories.ts'
import { toTagTerms } from './tags.ts'

describe('toDrinkCategoryTerms', () => {
  it("sorts by the master's order and drops entries without a numeric id", () => {
    assert.deepEqual(toDrinkCategoryTerms(drinkCategoriesFixture.list, 'ja'), [
      { id: 1, label: 'ビール', slug: 'beer' },
      { id: 2, label: '日本酒', slug: 'sake' },
    ])
  })

  it('uses the English name in English and leaves the input unsorted', () => {
    const items = [...drinkCategoriesFixture.list]
    const terms = toDrinkCategoryTerms(items, 'en')

    assert.deepEqual(
      terms.map((term) => term.label),
      ['Beer', 'Sake']
    )
    assert.deepEqual(items, drinkCategoriesFixture.list)
  })

  it('drops an entry without a slug, since its image is named after it', () => {
    const terms = toDrinkCategoryTerms(
      [
        { id: '3', order: '1', name: 'ジン', name_en: 'Gin', slug: '' },
        // The API is untyped JSON; a missing slug must not become `img-category-undefined`.
        { id: '4', order: '2', name: 'ラム', name_en: 'Rum', slug: null as unknown as string },
      ],
      'ja'
    )
    assert.deepEqual(terms, [])
  })
})

describe('toTagTerms', () => {
  it('skips a category that came back without tags', () => {
    assert.deepEqual(
      toTagTerms([{ ...tasteTagsFixture.list[0]!, tags: null }, ...tasteTagsFixture.list], 'ja'),
      [{ id: 11, label: '辛口' }]
    )
  })

  it('flattens every category, Japanese from tag_nm and English from ext_col_01', () => {
    assert.deepEqual(toTagTerms(tasteTagsFixture.list, 'ja'), [{ id: 11, label: '辛口' }])
    assert.deepEqual(toTagTerms(tasteTagsFixture.list, 'en'), [{ id: 11, label: 'Dry' }])
  })
})
