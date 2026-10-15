import * as assert from 'remix/assert'
import type { Handle } from 'remix/component'
import { createRouter } from 'remix/router'
import { describe, it } from 'remix/test'

import { API_URL } from '../env.ts'
import { useCspNonce } from '../ui/contexts/csp-nonce/csp-nonce.tsx'
import { buildCspDirective, createNonce, renderWithCsp } from './csp.tsx'

// Prints the nonce it receives through component context, so a test can compare
// it with the one in the header.
function NonceProbe(handle: Handle<object>) {
  const nonce = useCspNonce(handle)
  return () => <p id="nonce">{nonce ?? 'none'}</p>
}

const createTestRouter = () => {
  const router = createRouter({ middleware: [renderWithCsp()] })
  router.get('/', (context) => context.render(<NonceProbe />))
  router.get('/text', () => new Response('plain'))
  router.get('/own-policy', (context) =>
    context.render(<NonceProbe />, { headers: { 'Content-Security-Policy': "default-src 'self'" } })
  )
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

  it('substitutes only the nonce into an otherwise fixed policy', () => {
    assert.equal(
      buildCspDirective('a').replace("'nonce-a'", ''),
      buildCspDirective('b').replace("'nonce-b'", '')
    )
  })

  it('leaves no placeholder behind', () => {
    assert.doesNotMatch(policy, /\{\{nonce\}\}/)
  })

  it('allows everything under API_URL, not just that exact path', () => {
    // A source path without a trailing slash matches only itself.
    for (const name of ['img-src', 'connect-src']) {
      const sources = policy.match(new RegExp(`${name} ([^;]*)`))?.[1].split(' ') ?? []
      assert.ok(sources.includes(`${API_URL}/`), name)
      assert.ok(!sources.includes(API_URL), name)
    }
  })

  it("drops develop's unused Sentry origin", () => {
    assert.doesNotMatch(policy, /sentry/)
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

describe('renderWithCsp()', () => {
  it('passes the header nonce down to components through context', async () => {
    const response = await createTestRouter().fetch(new Request('http://localhost/'))
    const nonce = nonceFromHeader(response)

    assert.ok(nonce, 'the header carries a nonce')
    assert.equal(await nonceFromBody(response), nonce)
  })

  it('leaves a non-HTML response to the fallback policy', async () => {
    const response = await createTestRouter().fetch(new Request('http://localhost/text'))
    assert.equal(response.headers.get('Content-Security-Policy'), null)
  })

  it('keeps a policy the route set itself', async () => {
    const response = await createTestRouter().fetch(new Request('http://localhost/own-policy'))
    assert.equal(response.headers.get('Content-Security-Policy'), "default-src 'self'")
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
