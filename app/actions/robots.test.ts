import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { SITE_URL } from '../env.ts'
import { router } from '../router.ts'
import { robotsTxt } from './robots.ts'

describe('robots.txt', () => {
  it('names the sitemap and disallows everything outside an indexable production', () => {
    const closed = robotsTxt({ indexable: false })

    assert.match(closed, new RegExp(`^Sitemap: ${SITE_URL}/sitemap\\.xml$`, 'm'))
    assert.match(closed, /^User-agent: \*\nDisallow: \/$/m)
    assert.doesNotMatch(robotsTxt({ indexable: true }), /Disallow/)
  })

  it('is served as plain text, ahead of the /(:lang) home route', async () => {
    const response = await router.fetch(new Request('http://localhost/robots.txt'))

    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type') ?? '', /^text\/plain/)
    // Tests are not production, so the site is closed to crawlers.
    assert.match(await response.text(), /Disallow: \//)
  })
})
