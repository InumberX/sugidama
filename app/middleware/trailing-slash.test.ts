import * as assert from 'remix/assert'
import { createRouter } from 'remix/router'
import { describe, it } from 'remix/test'

import { trailingSlash } from './trailing-slash.ts'

const createTestRouter = () => {
  const router = createRouter({ middleware: [trailingSlash()] })
  router.get('/', () => new Response('home'))
  router.get('/en', () => new Response('en'))
  router.post('/form/', () => new Response('posted'))
  return router
}

const request = (path: string, method = 'GET') =>
  createTestRouter().fetch(new Request(`http://localhost${path}`, { method }))

describe('trailingSlash()', () => {
  it('redirects a trailing slash to the slash-less URL, query kept', async () => {
    for (const [path, location] of [
      ['/en/', '/en'],
      ['/en//', '/en'],
      ['/drinks/?page=2', '/drinks?page=2'],
    ]) {
      const response = await request(path)
      assert.equal(response.status, 301, path)
      assert.equal(response.headers.get('Location'), location, path)
    }
  })

  it('leaves the root and slash-less paths alone', async () => {
    assert.equal(await (await request('/')).text(), 'home')
    assert.equal(await (await request('/en')).text(), 'en')
  })

  it('never redirects off the site', async () => {
    const response = await request('//evil.example/')
    assert.equal(response.headers.get('Location'), '/')
  })

  it('lets other methods through, since a redirect would turn them into a GET', async () => {
    const response = await request('/form/', 'POST')
    assert.equal(await response.text(), 'posted')
  })
})
