import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { Document, GoogleAnalytics } from './document.tsx'

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

describe('GoogleAnalytics', () => {
  it('renders nothing without an id, the local default', async () => {
    assert.equal(await renderToString(<GoogleAnalytics id="" nonce="n" />), '')
  })

  it('puts the nonce on both the loader and the inline config', async () => {
    const html = await renderToString(<GoogleAnalytics id="G-TEST" nonce="abc" />)

    assert.equal(html.match(/<script[^>]* nonce="abc"/g)?.length, 2)
    assert.match(html, /src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-TEST"/)
    assert.match(html, /gtag\('config',"G-TEST"\)/)
  })

  it('cannot close its own script element from the id', async () => {
    const html = await renderToString(<GoogleAnalytics id="</script><b>x" nonce="abc" />)

    assert.equal(html.match(/<\/script>/g)?.length, 2)
  })
})
