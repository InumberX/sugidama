import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import {
  drinkabilityTagsEnFixture,
  mockKuroco,
  tasteTagsEnFixture,
  tasteTagsFixture,
} from '../../test/kuroco.ts'
import { getDrinkabilityTags, getTasteTags, toTagTerms } from './tags.ts'

describe('getTasteTags / getDrinkabilityTags', () => {
  it('name the language, Japanese included', async (t) => {
    const fetch = mockKuroco(t)
    await getTasteTags('ja')
    await getDrinkabilityTags('en')

    assert.deepEqual(
      fetch.mock.calls.map((call) => new URL(String(call.arguments[0])).searchParams.get('_lang')),
      ['ja', 'en']
    )
  })
})

describe('toTagTerms', () => {
  it('skips a category that came back without tags', () => {
    assert.deepEqual(
      toTagTerms([{ ...tasteTagsFixture.list[0]!, tags: null }, ...tasteTagsFixture.list]),
      [{ id: 11, label: '辛口' }]
    )
  })

  it('labels each tag with its title, in the language it was asked for', () => {
    assert.deepEqual(toTagTerms(tasteTagsFixture.list), [{ id: 11, label: '辛口' }])
    assert.deepEqual(toTagTerms(tasteTagsEnFixture.list), [{ id: 11, label: 'Dry' }])
  })

  it('labels a tag with its label instead, when it has one', () => {
    assert.deepEqual(toTagTerms(drinkabilityTagsEnFixture.list), [
      { id: 21, label: 'Easy to drink' },
    ])
  })

  it('falls back to the title when the label is empty, blank or missing', () => {
    const [category] = tasteTagsFixture.list
    // A missing label (`null`) must not throw on trim().
    for (const ext_col_01 of ['', ' \u3000\n', null]) {
      const tags = { '11': { tag_id: 11, tag_nm: '辛口', ext_col_01 } }
      assert.deepEqual(toTagTerms([{ ...category!, tags }]), [{ id: 11, label: '辛口' }])
    }
  })

  it('shows the label without the spaces around it', () => {
    const [category] = tasteTagsFixture.list
    const tags = { '11': { tag_id: 11, tag_nm: 'slightly_funky', ext_col_01: ' Slightly Funky ' } }

    assert.deepEqual(toTagTerms([{ ...category!, tags }]), [{ id: 11, label: 'Slightly Funky' }])
  })
})
