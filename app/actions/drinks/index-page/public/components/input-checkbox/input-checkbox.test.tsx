import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { InputCheckbox } from './input-checkbox.tsx'

const OPTIONS = [
  { value: '11', label: '辛口' },
  { value: '12', label: '甘口' },
]

describe('InputCheckbox', () => {
  it('renders a named group with one checkbox per option, checked from its values', async () => {
    const html = await renderToString(
      <InputCheckbox
        name="taste"
        label="味わい"
        options={OPTIONS}
        values={['12']}
        onToggle={() => {}}
      />
    )

    assert.match(html, /<fieldset aria-label="味わい"/)
    assert.match(html, /<input type="checkbox" name="taste" value="11"(?! checked)[^>]*>/)
    assert.match(html, /<input type="checkbox" name="taste" value="12" checked[^>]*>/)
    // The visible text is inside the label, so it names the checkbox.
    assert.match(
      html,
      /<label[^>]*><input[^>]*value="11"[^>]*>(?:(?!<\/label>).)*<span[^>]*>辛口<\/span><\/label>/
    )
  })
})
