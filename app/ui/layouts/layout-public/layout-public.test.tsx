import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { LayoutPublic } from './layout-public.tsx'

describe('LayoutPublic', () => {
  it('puts the page between the header and the footer, inside LayoutMain', async () => {
    const html = await renderToString(
      <LayoutPublic lang="ja" url={new URL('http://localhost/')}>
        <p>body</p>
      </LayoutPublic>
    )

    assert.match(html, /<\/header><main[^>]*><div[^>]*><p>body<\/p><\/div><\/main><footer/)
  })
})
