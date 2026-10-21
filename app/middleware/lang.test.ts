import * as assert from 'remix/assert'
import { createRouter } from 'remix/router'
import { get, post, route } from 'remix/routes'
import { describe, it } from 'remix/test'

import { lang } from './lang.ts'

const testRoutes = route({
  home: get('/(:lang)'),
  drinks: get('/(:lang/)drinks'),
  // A literal single segment, like a future /robots.txt, must win over /(:lang).
  about: get('/about'),
  submit: post('/(:lang/)submit'),
})

const createTestRouter = () => {
  const router = createRouter()
  router.map(testRoutes, {
    middleware: [lang()],
    actions: {
      home: (context) => new Response(context.lang),
      drinks: (context) => new Response(context.lang),
      about: () => new Response('about'),
      submit: (context) => new Response(context.lang),
    },
  })
  return router
}

const fetchPath = (path: string, method = 'GET') =>
  createTestRouter().fetch(new Request(`http://localhost${path}`, { method }))

describe('lang()', () => {
  it('treats a path without a prefix as Japanese', async () => {
    for (const path of ['/', '/drinks']) {
      const response = await fetchPath(path)
      assert.equal(response.status, 200, path)
      assert.equal(await response.text(), 'ja', path)
    }
  })

  it('treats an /en prefix as English', async () => {
    for (const path of ['/en', '/en/drinks']) {
      const response = await fetchPath(path)
      assert.equal(response.status, 200, path)
      assert.equal(await response.text(), 'en', path)
    }
  })

  it('redirects a /ja prefix to the same page without it, keeping the query', async () => {
    const cases = [
      ['/ja', '/'],
      ['/ja/drinks', '/drinks'],
      ['/ja/drinks?keyword=sake&page=2', '/drinks?keyword=sake&page=2'],
      // The param is decoded, so an encoded `ja` reaches the redirect too.
      ['/%6Aa', '/'],
      ['/j%61/drinks', '/drinks'],
    ]
    for (const [path, location] of cases) {
      const response = await fetchPath(path)
      assert.equal(response.status, 302, path)
      assert.equal(response.headers.get('Location'), location, path)
    }
  })

  it('redirects a percent-encoded en to the canonical /en, keeping the rest', async () => {
    for (const [path, location] of [
      ['/%65n', '/en'],
      ['/e%6E/drinks?page=2', '/en/drinks?page=2'],
    ]) {
      const response = await fetchPath(path)
      assert.equal(response.status, 302, path)
      assert.equal(response.headers.get('Location'), location, path)
    }
  })

  it('keeps the method when redirecting anything but GET or HEAD', async () => {
    for (const [path, location] of [
      ['/ja/submit', '/submit'],
      ['/%65n/submit', '/en/submit'],
    ]) {
      const response = await fetchPath(path, 'POST')
      assert.equal(response.status, 307, path)
      assert.equal(response.headers.get('Location'), location, path)
    }
  })

  it('lets a literal single-segment route win over /(:lang)', async () => {
    const response = await fetchPath('/about')
    assert.equal(await response.text(), 'about')
  })

  it('answers 404 for any other prefix', async () => {
    for (const path of ['/fr', '/EN', '/nope', '/fr/drinks']) {
      const response = await fetchPath(path)
      assert.equal(response.status, 404, path)
    }
  })
})
