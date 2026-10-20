import * as assert from 'remix/assert'
import { createRouter } from 'remix/router'
import { get, route } from 'remix/routes'
import { describe, it } from 'remix/test'

import { drinkDetailFixture, mockKuroco } from '../../test/kuroco.ts'
import { router } from '../router.ts'
import { renderWithCsp } from './csp.tsx'
import { errorPage, langOfPath } from './error-page.tsx'

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

  it("switches language to the other language's home, not the broken path", async () => {
    const ja = await (await fetchPath('/ja/nope/x')).text()
    const en = await (await fetchPath('/en/nope/x')).text()

    assert.match(ja, /<a href="\/en"[^>]*><span[^>]*>EN<\/span>/)
    assert.match(en, /<a href="\/"[^>]*><span[^>]*>JA<\/span>/)
  })

  it('keeps the status and the Allow header of a 405', async () => {
    const response = await fetchPath('/nope', {
      method: 'POST',
      headers: { 'Sec-Fetch-Site': 'same-origin' },
    })

    const html = await response.text()

    assert.equal(response.status, 405)
    assert.equal(response.headers.get('Allow'), 'GET, HEAD')
    assert.match(response.headers.get('Content-Type') ?? '', /^text\/html/)
    // The page exists; it only refused the method.
    assert.doesNotMatch(titleOf(html), /見つかりません/)
    assert.match(html, /このページを表示できませんでした。/)
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

describe('errorPage() and files', () => {
  it('leaves a missing file a plain 404, unless a browser asks for a page', async () => {
    const asset = await fetchPath('/client/app/gone.js', { headers: { Accept: '*/*' } })
    const page = await fetchPath('/old.html', { headers: { Accept: 'text/html' } })

    assert.equal(asset.status, 404)
    assert.doesNotMatch(asset.headers.get('Content-Type') ?? '', /html/)
    assert.equal(page.status, 404)
    assert.match(page.headers.get('Content-Type') ?? '', /^text\/html/)
  })

  it('says the answer for a file varies by Accept, and keeps a dotted slug a page', async () => {
    const asset = await fetchPath('/client/app/gone.js', { headers: { Accept: '*/*' } })
    const page = await fetchPath('/client/app/gone.js', { headers: { Accept: 'text/html' } })
    const dotted = await fetchPath('/a/dassai.23', { headers: { Accept: '*/*' } })

    assert.equal(asset.headers.get('Vary'), 'Accept')
    assert.match(page.headers.get('Vary') ?? '', /Accept/)
    assert.match(dotted.headers.get('Content-Type') ?? '', /^text\/html/)
  })

  it('keeps every Set-Cookie of the plain response', async () => {
    const testRouter = createRouter({ middleware: [renderWithCsp(), errorPage()] })
    testRouter.map(route({ gone: get('/gone') }), {
      actions: {
        gone: () => {
          const headers = new Headers()
          headers.append('Set-Cookie', 'a=1')
          headers.append('Set-Cookie', 'b=2')
          return new Response(null, { status: 404, headers })
        },
      },
    })
    const response = await testRouter.fetch(new Request('http://localhost/gone'))

    assert.match(response.headers.get('Content-Type') ?? '', /^text\/html/)
    assert.deepEqual(response.headers.getSetCookie(), ['a=1', 'b=2'])
  })

  it('names no canonical URL for an error', async () => {
    const html = await (await fetchPath('/drinks?page=0')).text()

    assert.doesNotMatch(html, /rel="canonical"/)
    assert.doesNotMatch(html, /og:url/)
  })
})

describe('langOfPath', () => {
  it('reads the prefix as lang() does, Japanese otherwise', () => {
    assert.equal(langOfPath('/en'), 'en')
    assert.equal(langOfPath('/en/drinks/x'), 'en')
    assert.equal(langOfPath('/'), 'ja')
    assert.equal(langOfPath('/english'), 'ja')
    assert.equal(langOfPath('/fr/drinks'), 'ja')
    assert.equal(langOfPath('/%65n/drinks/x'), 'en')
    assert.equal(langOfPath('/%E0%A4%A/x'), 'ja')
  })
})
