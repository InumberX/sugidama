import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { LayoutMain } from './layout-main.tsx'

describe('LayoutMain', () => {
  it('renders the requested tag and opens a query container', async () => {
    assert.match(await renderToString(<LayoutMain>x</LayoutMain>), /<main/)
    assert.match(await renderToString(<LayoutMain tag="section">x</LayoutMain>), /<section/)
    assert.match(await renderToString(<LayoutMain>x</LayoutMain>), /container-name: layout-main/)
  })

  it('lays the content on a white sheet inside the capped column', async () => {
    const html = await renderToString(<LayoutMain>x</LayoutMain>)

    assert.match(html, /<main[^>]*><div[^>]*>x<\/div><\/main>/)
    assert.match(html, /background-color: var\(--color-background-light\)/)
    assert.match(html, /max-inline-size: calc\(var\(--layout-inner-width-large\)/)
  })
})
