import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { Document } from './document.tsx'

describe('Document', () => {
  it('renders no module script of its own', async () => {
    // No page hydrates a client entry yet, and Workers has no asset server to
    // compile one. A module script here would 404 in production.
    const html = await renderToString(<Document url={new URL('http://localhost/')} />)

    assert.doesNotMatch(html, /<script[^>]* type="(module|importmap)"/)
  })

  it('renders the page head slot after the stylesheet and the metadata', async () => {
    const html = await renderToString(
      <Document
        url={new URL('http://localhost/')}
        head={<link rel="preload" href="/page-asset.webp" as="image" />}
      />
    )

    const stylesheet = html.indexOf('/static/css/app.css')
    const canonical = html.indexOf('rel="canonical"')
    const slot = html.indexOf('href="/page-asset.webp"')

    assert.ok(stylesheet !== -1 && canonical !== -1 && slot !== -1, 'all three are rendered')
    assert.ok(stylesheet < slot && canonical < slot, 'head slot comes last')
  })
})
