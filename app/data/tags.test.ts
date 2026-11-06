import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { tasteTagsFixture } from '../../test/kuroco.ts'
import { toTagTerms } from './tags.ts'

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
