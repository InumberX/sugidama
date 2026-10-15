import * as assert from 'remix/assert'
import type { Handle } from 'remix/component'
import { render } from 'remix/middleware/render'
import { createRouter } from 'remix/router'
import { describe, it } from 'remix/test'

import { buildCspDirective, createNonce, csp, useCspNonce, withHeaders } from './csp.tsx'

// Prints the nonce it receives through component context, so a test can compare
// it with the one in the header.
function NonceProbe(handle: Handle<object>) {
  const nonce = useCspNonce(handle)
  return () => <p id="nonce">{nonce ?? 'none'}</p>
}

const createTestRouter = () => {
  const router = createRouter({ middleware: [render(), csp()] })
  router.get('/', (context) => context.render(<NonceProbe />))
  return router
}

const nonceFromHeader = (response: Response): string | undefined =>
  response.headers.get('Content-Security-Policy')?.match(/'nonce-([^']+)'/)?.[1]

const nonceFromBody = async (response: Response): Promise<string | undefined> =>
  (await response.text()).match(/<p id="nonce">([^<]*)<\/p>/)?.[1]

describe('createNonce', () => {
  it('returns 128 random bits as base64, different every time', () => {
    const a = createNonce()
    const b = createNonce()
    assert.equal(atob(a).length, 16)
    assert.notEqual(a, b)
  })
})

describe('buildCspDirective', () => {
  const policy = buildCspDirective('test-nonce')

  it('allows scripts only from this origin, Google Tag Manager and the nonce', () => {
    assert.match(
      policy,
      /script-src 'self' 'nonce-test-nonce' 'strict-dynamic' https:\/\/www\.googletagmanager\.com;/
    )
    assert.doesNotMatch(policy.match(/script-src[^;]*/)?.[0] ?? '', /'unsafe-inline'/)
  })

  it('keeps every directive develop sent', () => {
    for (const name of [
      'default-src',
      'script-src',
      'style-src',
      'font-src',
      'img-src',
      'connect-src',
      'frame-src',
      'media-src',
      'worker-src',
      'object-src',
      'base-uri',
      'form-action',
      'frame-ancestors',
    ]) {
      assert.match(policy, new RegExp(`(^|; )${name} `), name)
    }
    assert.match(policy, /object-src 'none'/)
    assert.match(policy, /frame-ancestors 'none'/)
  })
})

describe('csp()', () => {
  it('passes the header nonce down to components through context', async () => {
    const response = await createTestRouter().fetch(new Request('http://localhost/'))
    const nonce = nonceFromHeader(response)

    assert.ok(nonce, 'the header carries a nonce')
    assert.equal(await nonceFromBody(response), nonce)
  })

  it('uses a fresh nonce for every request', async () => {
    const router = createTestRouter()
    const first = await router.fetch(new Request('http://localhost/'))
    const second = await router.fetch(new Request('http://localhost/'))

    assert.notEqual(nonceFromHeader(first), nonceFromHeader(second))
  })
})

describe('useCspNonce', () => {
  it('is undefined outside a request', async () => {
    const { renderToString } = await import('remix/component/server')
    assert.match(await renderToString(<NonceProbe />), /<p id="nonce">none<\/p>/)
  })
})

describe('withHeaders', () => {
  it('copies a response whose headers are immutable', () => {
    const redirect = Response.redirect('http://localhost/elsewhere', 302)
    const result = withHeaders(redirect, { 'X-Test': '1' })

    assert.equal(result.headers.get('X-Test'), '1')
    assert.equal(result.status, 302)
    assert.equal(result.headers.get('Location'), 'http://localhost/elsewhere')
  })
})
