import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { mockKuroco, tasteTagsEnFixture, tasteTagsFixture } from '../../test/kuroco.ts'
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

  it('labels each tag with its display name, in the language it was asked for', () => {
    assert.deepEqual(toTagTerms(tasteTagsFixture.list), [{ id: 11, label: '辛口' }])
    assert.deepEqual(toTagTerms(tasteTagsEnFixture.list), [{ id: 11, label: 'Dry' }])
  })

  it('falls back to the identifier when the display name is empty, blank or missing', () => {
    const [category] = tasteTagsFixture.list
    // The API is untyped JSON; a missing display name must not throw on trim().
    for (const ext_col_01 of ['', ' \u3000\n', null as unknown as string]) {
      const tags = { '11': { tag_id: 11, tag_nm: 'dry', ext_col_01 } }
      assert.deepEqual(toTagTerms([{ ...category!, tags }]), [{ id: 11, label: 'dry' }])
    }
  })

  it('shows the display name without the spaces around it', () => {
    const [category] = tasteTagsFixture.list
    const tags = { '11': { tag_id: 11, tag_nm: 'dry', ext_col_01: ' 辛口 ' } }

    assert.deepEqual(toTagTerms([{ ...category!, tags }]), [{ id: 11, label: '辛口' }])
  })
})
