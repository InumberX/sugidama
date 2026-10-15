import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from '../router.ts'
import { routes } from '../routes.ts'

describe('root controller', () => {
  it('renders the home page', async () => {
    const response = await router.fetch(new Request(`http://localhost${routes.home.href()}`))

    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type') ?? '', /^text\/html/)
  })

  it('serves the dev gallery outside production', async () => {
    const response = await router.fetch(new Request(`http://localhost${routes.devUi.href()}`))

    assert.equal(response.status, 200)
    assert.match(await response.text(), /UI ギャラリー/)
  })

  it('answers 404 for an unmapped path', async () => {
    const response = await router.fetch(new Request('http://localhost/nope'))

    assert.equal(response.status, 404)
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
