import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { LayoutHeader } from './layout-header.tsx'

const at = (path: string) => new URL(`http://localhost${path}`)

describe('LayoutHeader', () => {
  it('links the logo and the global menu to the pages in the current language', async () => {
    const ja = await renderToString(<LayoutHeader lang="ja" url={at('/drinks')} />)
    const en = await renderToString(<LayoutHeader lang="en" url={at('/en/drinks')} />)

    assert.match(
      ja,
      /<a href="\/"[^>]*><img src="\/static\/img\/img-logo\.webp(?:\?[^"]*)?" alt="Sugidama" width="160" height="41"/
    )
    assert.match(ja, /<a href="\/drinks"[^>]*>.*お酒一覧<\/span><\/a>/)
    assert.match(ja, /ホーム/)
    assert.match(en, /<a href="\/en"[^>]*><img/)
    assert.match(en, /<a href="\/en\/drinks"[^>]*>.*Drinks<\/span><\/a>/)
  })

  it('switches language to the same page, keeping the query', async () => {
    const html = await renderToString(<LayoutHeader lang="ja" url={at('/drinks?drink=1')} />)

    assert.match(html, /<span[^>]*>JA<\/span>/)
    assert.match(html, /<a href="\/en\/drinks\?drink=1"[^>]*><span[^>]*>EN<\/span><\/a>/)
    assert.doesNotMatch(html, /href="[^"]*"[^>]*><span[^>]*>JA</)
  })

  it('makes the logo the page title only when asked', async () => {
    const home = await renderToString(<LayoutHeader lang="ja" url={at('/')} isLogoTitle />)
    const other = await renderToString(<LayoutHeader lang="ja" url={at('/drinks')} />)

    assert.match(home, /<h1[^>]*><a href="\/"/)
    assert.doesNotMatch(other, /<h1/)
  })

  it('draws its icons in the link color and hides them from assistive technology', async () => {
    const html = await renderToString(<LayoutHeader lang="ja" url={at('/')} />)

    assert.match(html, /icon-home\.svg/)
    assert.match(html, /icon-liquor\.svg/)
    assert.match(html, /background-color: currentColor/)
    assert.equal([...html.matchAll(/<i aria-hidden="true"/g)].length, 3)
  })
})
