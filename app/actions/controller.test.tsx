import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from '../router.ts'
import { routes } from '../routes.ts'
import { toLangParam } from '../utils/i18n.ts'

describe('root controller', () => {
  it('renders the home page', async () => {
    const response = await router.fetch(new Request(`http://localhost${routes.home.href()}`))

    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type') ?? '', /^text\/html/)
  })

  it('renders the home page in English under /en', async () => {
    const response = await router.fetch(
      new Request(`http://localhost${routes.home.href({ lang: toLangParam('en') })}`)
    )

    assert.equal(response.status, 200)
    assert.match(await response.text(), /<html lang="en">/)
  })

  it('renders the home page in Japanese without a prefix', async () => {
    const href = routes.home.href({ lang: toLangParam('ja') })
    const response = await router.fetch(new Request(`http://localhost${href}`))

    assert.equal(href, '/')
    assert.match(await response.text(), /<html lang="ja">/)
  })

  it('redirects /ja to the unprefixed URL', async () => {
    const response = await router.fetch(new Request('http://localhost/ja'))

    assert.equal(response.status, 302)
    assert.equal(response.headers.get('Location'), '/')
  })

  it('serves the dev gallery outside production', async () => {
    const response = await router.fetch(new Request(`http://localhost${routes.devUi.href()}`))

    assert.equal(response.status, 200)
    assert.match(await response.text(), /UI ギャラリー/)
  })

  it('answers 404 for an unmapped path', async () => {
    // One segment matches `/(:lang)` and is rejected by lang(); two match nothing.
    for (const path of ['/nope', '/nope/deeper']) {
      const response = await router.fetch(new Request(`http://localhost${path}`))
      assert.equal(response.status, 404, path)
    }
  })

  it('sends the security headers and a nonce-based CSP with the page', async () => {
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
