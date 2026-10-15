import * as assert from 'remix/assert'
import { createRouter } from 'remix/router'
import { describe, it } from 'remix/test'

import { PRODUCTION_ONLY, securityHeaders } from './security-headers.ts'

const createTestRouter = () => {
  const router = createRouter({ middleware: [securityHeaders()] })
  router.get('/', () => new Response('ok'))
  router.get('/moved', () => Response.redirect('http://localhost/', 302))
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

  // `npm test` runs with NODE_ENV=test and app/env.ts is read once at load, so
  // the production branch is checked through the value it sends instead.
  it('sends a two-year, preload-ready HSTS policy in production', () => {
    assert.equal(
      PRODUCTION_ONLY['Strict-Transport-Security'],
      'max-age=63072000; includeSubDomains; preload'
    )
  })

  it('leaves HSTS off outside production, so localhost is never pinned to HTTPS', async () => {
    const response = await createTestRouter().fetch(new Request('http://localhost/'))
    assert.equal(response.headers.get('Strict-Transport-Security'), null)
  })
})
