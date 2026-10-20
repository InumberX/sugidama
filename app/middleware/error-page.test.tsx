import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { drinkDetailFixture, mockKuroco } from '../../test/kuroco.ts'
import { router } from '../router.ts'
import { langOfPath } from './error-page.tsx'

const fetchPath = (path: string, init?: RequestInit) =>
  router.fetch(new Request(`http://localhost${path}`, init))

const titleOf = (html: string) => html.match(/<title>(.*?)<\/title>/)?.[1] ?? ''

describe('errorPage()', () => {
  it('renders one page for every way a 404 is reached', async () => {
    // The router's own (nothing matches), lang()'s, and a route's own.
    for (const path of ['/a/b', '/fr/drinks', '/drinks?page=0']) {
      const response = await fetchPath(path)
      const html = await response.text()

      assert.equal(response.status, 404, path)
      assert.match(response.headers.get('Content-Type') ?? '', /^text\/html/, path)
      assert.match(titleOf(html), /^ページが見つかりません \| /, path)
      assert.match(html, /<meta name="robots" content="noindex, nofollow"/, path)
      // The page's own nonce policy, not the plain-text fallback.
      assert.match(response.headers.get('Content-Security-Policy') ?? '', /nonce-/, path)
    }
  })

  it('speaks the language of the path', async () => {
    const html = await (await fetchPath('/en/nope/x')).text()

    assert.match(html, /<html lang="en">/)
    assert.match(titleOf(html), /^Page not found/)
    assert.match(html, /<a href="\/en"[^>]*>.*Back to Home/s)
  })

  it('keeps the status and the Allow header of a 405', async () => {
    const response = await fetchPath('/nope', {
      method: 'POST',
      headers: { 'Sec-Fetch-Site': 'same-origin' },
    })

    assert.equal(response.status, 405)
    assert.equal(response.headers.get('Allow'), 'GET, HEAD')
    assert.match(response.headers.get('Content-Type') ?? '', /^text\/html/)
  })

  it('shows an API failure as an error, with its status and none of its words', async (t) => {
    t.mock.method(console, 'error', () => {})
    mockKuroco(t, {
      '/drinks/kubota': drinkDetailFixture(),
      '/tags/taste': new Response(null, { status: 503, statusText: 'Down' }),
    })
    const response = await fetchPath('/drinks/kubota')
    const html = await response.text()

    assert.equal(response.status, 503)
    assert.match(titleOf(html), /^エラーが発生しました/)
    assert.doesNotMatch(html, /Down/)
  })

  it('leaves a response with a type of its own alone', async (t) => {
    t.mock.method(console, 'error', () => {})
    mockKuroco(t, { '/drinks': new Response(null, { status: 503 }) })
    const response = await fetchPath('/sitemap.xml')

    assert.equal(response.status, 503)
    assert.match(response.headers.get('Content-Type') ?? '', /^application\/xml/)
  })
})

describe('langOfPath', () => {
  it('reads the prefix as lang() does, Japanese otherwise', () => {
    assert.equal(langOfPath('/en'), 'en')
    assert.equal(langOfPath('/en/drinks/x'), 'en')
    assert.equal(langOfPath('/'), 'ja')
    assert.equal(langOfPath('/english'), 'ja')
    assert.equal(langOfPath('/fr/drinks'), 'ja')
  })
})
