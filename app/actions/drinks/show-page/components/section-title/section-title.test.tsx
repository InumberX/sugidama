import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { SectionTitle } from './section-title.tsx'

describe('SectionTitle', () => {
  it('is an h2, with the bar hidden from assistive technology', async () => {
    const html = await renderToString(<SectionTitle title="新着のお酒" />)

    assert.match(html, /<span aria-hidden="true"[^>]*><\/span><h2[^>]*>新着のお酒<\/h2>/)
  })
})
