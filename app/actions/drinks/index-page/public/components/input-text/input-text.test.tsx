import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { InputText } from './input-text.tsx'

describe('InputText', () => {
  it('renders an uncontrolled text field with its starting value', async () => {
    const html = await renderToString(
      <InputText id="kw" name="keyword" defaultValue="辛口" placeholder="入力" />
    )

    assert.match(html, /<input type="text"[^>]* id="kw"[^>]* name="keyword"/)
    assert.match(html, / value="辛口"/)
    assert.match(html, / placeholder="入力"/)
  })
})
