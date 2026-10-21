import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { FormSubSet } from './form-sub-set.tsx'

describe('FormSubSet', () => {
  it('makes the title the label of the field it names', async () => {
    const html = await renderToString(
      <FormSubSet title="キーワード" htmlFor="kw">
        <input id="kw" />
      </FormSubSet>
    )

    assert.match(html, /<dt[^>]*><label for="kw">キーワード<\/label><\/dt>/)
  })

  it('leaves the title plain text without a field to name', async () => {
    const html = await renderToString(<FormSubSet title="条件">x</FormSubSet>)

    assert.match(html, /<dt[^>]*>条件<\/dt>/)
  })
})
