import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { CACHE_BUSTER } from '../../env.ts'
import { router } from '../../router.ts'
import { STATIC_QUERY_ATTRIBUTE, staticUrl } from './static-url.ts'

describe('staticUrl', () => {
  it('adds the cache buster app/router.ts sets', () => {
    // Importing the router has set it, as it does when the Worker starts.
    assert.ok(router)
    assert.equal(
      staticUrl('/static/img/img-logo.webp'),
      `/static/img/img-logo.webp?${CACHE_BUSTER}`
    )
  })

  it('writes the same query into <html> for the browser, and puts it on the page images', async () => {
    const html = await (await router.fetch(new Request('http://localhost/dev/ui'))).text()

    assert.ok(html.includes(`<html lang="ja" ${STATIC_QUERY_ATTRIBUTE}="${CACHE_BUSTER}"`))
    assert.ok(html.includes(`/static/img/img-logo.webp?${CACHE_BUSTER}`))
    assert.ok(html.includes(`/static/img/img-category-sake.webp?${CACHE_BUSTER}`))
    assert.ok(html.includes(`url(/static/img/icon-home.svg?${CACHE_BUSTER})`))
    // The OGP image keeps a stable URL (CLAUDE.md, Caching).
    assert.match(html, /<meta property="og:image" content="[^"?]*\/static\/img\/img-ogp\.jpg"/)
  })
})
