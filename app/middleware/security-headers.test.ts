import * as assert from 'remix/assert'
import { createRouter } from 'remix/router'
import { describe, it } from 'remix/test'

import { securityHeaders, type SecurityHeadersOptions } from './security-headers.ts'

const createTestRouter = (options?: SecurityHeadersOptions) => {
  const router = createRouter({ middleware: [securityHeaders(options)] })
  router.get('/', () => new Response('ok'))
  router.get('/moved', () => Response.redirect('http://localhost/', 302))
  router.get('/boom', () => {
    throw new Error('boom')
  })
  return router
}

describe('securityHeaders()', () => {
  it('sends nosniff and DENY on every response', async () => {
    const router = createTestRouter()
    for (const path of ['/', '/moved', '/missing']) {
      const response = await router.fetch(new Request(`http://localhost${path}`))
      assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff', path)
      assert.equal(response.headers.get('X-Frame-Options'), 'DENY', path)
    }
  })

  it('sends a two-year, preload-ready HSTS policy in production', async () => {
    const response = await createTestRouter({ production: true }).fetch(
      new Request('http://localhost/')
    )
    assert.equal(
      response.headers.get('Strict-Transport-Security'),
      'max-age=63072000; includeSubDomains; preload'
    )
  })

  it('leaves HSTS off outside production, so localhost is never pinned to HTTPS', async () => {
    const response = await createTestRouter({ production: false }).fetch(
      new Request('http://localhost/')
    )
    assert.equal(response.headers.get('Strict-Transport-Security'), null)
  })

  it('turns a thrown error into a generic 500 that still carries the headers', async (t) => {
    const consoleError = t.mock.method(console, 'error', () => {})
    const response = await createTestRouter({ production: true }).fetch(
      new Request('http://localhost/boom')
    )

    assert.equal(response.status, 500)
    assert.equal(await response.text(), 'Internal Server Error')
    assert.equal(response.headers.get('X-Frame-Options'), 'DENY')
    assert.ok(response.headers.get('Strict-Transport-Security'))
    assert.equal(consoleError.mock.calls.length, 1)
  })
})
