import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { CspNonceProvider } from '../ui/contexts/csp-nonce/csp-nonce.tsx'
import { CLIENT_RUNTIME_URL, Document, GoogleAnalytics } from './document.tsx'

describe('Document', () => {
  it('renders no module script unless the page hydrates something', async () => {
    const html = await renderToString(<Document lang="ja" url={new URL('http://localhost/')} />)

    assert.doesNotMatch(html, /<script[^>]* type="(module|importmap)"/)
  })

  it('loads the compiled browser runtime, with the nonce, for a page with client entries', async () => {
    const html = await renderToString(
      <CspNonceProvider nonce="abc">
        <Document lang="ja" url={new URL('http://localhost/')} hasClientEntries />
      </CspNonceProvider>
    )

    assert.equal(CLIENT_RUNTIME_URL, '/client/app/actions/public/entry.js')
    assert.match(
      html,
      /<script type="module" nonce="abc" src="\/client\/app\/actions\/public\/entry\.js"><\/script>/
    )
  })

  it('renders the page head slot after the stylesheet and the metadata', async () => {
    const html = await renderToString(
      <Document
        lang="ja"
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

  it('declares the page language on <html>', async () => {
    const html = await renderToString(<Document lang="en" url={new URL('http://localhost/en')} />)

    assert.match(html, /<html lang="en"[ >]/)
  })
})
