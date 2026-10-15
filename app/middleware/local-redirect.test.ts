import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { localRedirect } from './local-redirect.ts'

const url = new URL('https://sugidama.example/ja/drinks?keyword=sake')

describe('localRedirect()', () => {
  it('redirects to a root-relative path on this site, query kept', () => {
    const response = localRedirect(url, '/drinks?keyword=sake')
    assert.equal(response.status, 302)
    assert.equal(response.headers.get('Location'), '/drinks?keyword=sake')
  })

  it('takes another status', () => {
    assert.equal(localRedirect(url, '/drinks', 301).status, 301)
  })

  it('sends anything that would leave the site to /', () => {
    for (const path of [
      '//evil.example/',
      '//evil.example',
      'https://evil.example/x',
      '/\\evil.example',
    ]) {
      assert.equal(localRedirect(url, path).headers.get('Location'), '/', path)
    }
  })
})
