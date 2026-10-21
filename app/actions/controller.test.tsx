import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { mockKuroco } from '../../test/kuroco.ts'
import { router } from '../router.ts'
import { routes } from '../routes.ts'
import { toLangParam } from '../utils/i18n.ts'

describe('root controller', () => {
  it('renders the home page', async (t) => {
    mockKuroco(t)
    const response = await router.fetch(new Request(`http://localhost${routes.home.href()}`))

    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type') ?? '', /^text\/html/)
  })

  it('gives the home page one <h1>, in the page body as on develop', async (t) => {
    mockKuroco(t)
    const html = await (await router.fetch(new Request('http://localhost/'))).text()

    assert.equal([...html.matchAll(/<h1\b/g)].length, 1)
    assert.doesNotMatch(html, /<h1[^>]*><a\b/)
  })

  it('renders the home page in English under /en', async (t) => {
    mockKuroco(t)
    const response = await router.fetch(
      new Request(`http://localhost${routes.home.href({ lang: toLangParam('en') })}`)
    )

    assert.equal(response.status, 200)
    assert.match(await response.text(), /<html lang="en"[ >]/)
  })

  it('renders the home page in Japanese without a prefix', async (t) => {
    mockKuroco(t)
    const href = routes.home.href({ lang: toLangParam('ja') })
    const response = await router.fetch(new Request(`http://localhost${href}`))

    assert.equal(href, '/')
    assert.match(await response.text(), /<html lang="ja"[ >]/)
  })

  it('redirects a trailing slash before the language is resolved', async () => {
    const response = await router.fetch(new Request('http://localhost/en/'))

    assert.equal(response.status, 308)
    assert.equal(response.headers.get('Location'), '/en')
  })

  it('redirects /ja to the unprefixed URL', async () => {
    const response = await router.fetch(new Request('http://localhost/ja'))

    assert.equal(response.status, 302)
    assert.equal(response.headers.get('Location'), '/')
  })

  it('moves the old /assets/img/ URLs to /static/img/ for good', async () => {
    const response = await router.fetch(
      new Request('http://localhost/assets/img/img-ogp.jpg?ver=old')
    )

    assert.equal(response.status, 301)
    assert.equal(response.headers.get('Location'), '/static/img/img-ogp.jpg')
  })

  it('serves the dev gallery outside production', async () => {
    const response = await router.fetch(new Request(`http://localhost${routes.devUi.href()}`))

    assert.equal(response.status, 200)
    const html = await response.text()
    assert.match(html, /UI ギャラリー/)
    assert.match(html, /<html lang="ja"[ >]/)
  })

  it('answers 404 for an unmapped path', async () => {
    // One segment matches `/(:lang)` and is rejected by lang(); two match nothing.
    for (const path of ['/nope', '/nope/deeper']) {
      const response = await router.fetch(new Request(`http://localhost${path}`))
      assert.equal(response.status, 404, path)
    }
  })

  it('sends the security headers and a nonce-based CSP with the page', async (t) => {
    mockKuroco(t)
    const response = await router.fetch(new Request(`http://localhost${routes.home.href()}`))

    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff')
    assert.equal(response.headers.get('X-Frame-Options'), 'DENY')
    assert.match(response.headers.get('Content-Security-Policy') ?? '', /script-src [^;]*'nonce-/)
  })

  it('rejects a cross-site POST before routing, with the security headers', async () => {
    const response = await router.fetch(
      new Request('http://localhost/', {
        method: 'POST',
        headers: { 'Sec-Fetch-Site': 'cross-site' },
      })
    )

    assert.equal(response.status, 403)
    assert.equal(response.headers.get('X-Frame-Options'), 'DENY')
  })

  it('lets a same-origin POST through to routing', async () => {
    const response = await router.fetch(
      new Request('http://localhost/', {
        method: 'POST',
        headers: { 'Sec-Fetch-Site': 'same-origin' },
      })
    )

    // No POST route exists yet; anything but cop()'s 403 means it got past it.
    assert.notEqual(response.status, 403)
  })
})
