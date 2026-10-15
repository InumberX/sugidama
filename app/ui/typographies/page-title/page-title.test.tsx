import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { PageTitle } from './page-title.tsx'

describe('PageTitle', () => {
  it('is an h1 in the base color by default', async () => {
    const html = await renderToString(<PageTitle title="お酒一覧" />)

    assert.match(html, /<h1[^>]*><span[^>]*>お酒一覧<\/span><\/h1>/)
    assert.match(html, /color: var\(--color-font-base\)/)
    assert.doesNotMatch(html, /background-clip: text/)
    assert.doesNotMatch(html, /max-inline-size/)
  })

  it('fills the primary title with the brand gradient', async () => {
    const html = await renderToString(<PageTitle title="Drinks" color="primary" titleTag="h2" />)

    assert.match(html, /<h2/)
    assert.match(html, /linear-gradient\(90deg, var\(--color-gradation-primary\)\)/)
    assert.match(html, /background-clip: text/)
  })

  it('wraps itself in padding and a LayoutInner when asked', async () => {
    const html = await renderToString(<PageTitle title="a" isWrap innerProps={{ size: 'full' }} />)

    assert.match(html, /padding-block: clamp\(24px/)
    assert.match(html, /max-inline-size: none/)
  })
})
