import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { drinkFixture, drinksFixture, mockKuroco } from '../../test/kuroco.ts'
import { SITE_URL } from '../env.ts'
import { router } from '../router.ts'
import { toSitemapXml } from './sitemap.ts'

const get = () => router.fetch(new Request('http://localhost/sitemap.xml'))

describe('sitemap.xml', () => {
  it('lists both languages of the home page, the list and every drink, asking for all drinks', async (t) => {
    const fetch = mockKuroco(t, {
      '/drinks': drinksFixture([
        drinkFixture(),
        drinkFixture({ topics_id: 7, slug: '' }),
        // Names no page: getDrinkDetail() answers it with a 404.
        drinkFixture({ topics_id: 8, slug: '..' }),
      ]),
    })
    const response = await get()
    const xml = await response.text()
    const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, loc]) =>
      loc!.slice(SITE_URL.length)
    )

    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type') ?? '', /^application\/xml/)
    assert.deepEqual(locs, [
      '/',
      '/drinks',
      '/en',
      '/en/drinks',
      '/drinks/kubota',
      '/en/drinks/kubota',
      '/drinks/7',
      '/en/drinks/7',
    ])
    assert.equal(new URL(String(fetch.mock.calls[0]?.arguments[0])).searchParams.get('cnt'), '-1')
  })

  it('leaves out <lastmod> without a deploy time, and escapes each URL', () => {
    const entry = { path: '/drinks/a&b', priority: 0.5, changefreq: 'weekly' as const }

    assert.doesNotMatch(toSitemapXml([entry], undefined), /lastmod/)
    assert.match(
      toSitemapXml([entry], '2026-10-20T00:00:00Z'),
      /<lastmod>2026-10-20T00:00:00Z<\/lastmod>/
    )
    assert.match(toSitemapXml([entry], undefined), /<loc>[^<]*\/drinks\/a&amp;b<\/loc>/)
    // The schema's sequence: loc, lastmod, changefreq, priority.
    const order = [...toSitemapXml([entry], 'x').matchAll(/<(loc|lastmod|changefreq|priority)>/g)]
    assert.deepEqual(
      order.map(([, name]) => name),
      ['loc', 'lastmod', 'changefreq', 'priority']
    )
  })

  it('keeps the XML type on failure, without a page around it', async (t) => {
    t.mock.method(console, 'error', () => {})
    mockKuroco(t, { '/drinks': new Response(null, { status: 503 }) })
    const response = await get()

    assert.equal(response.status, 503)
    assert.match(response.headers.get('Content-Type') ?? '', /^application\/xml/)
  })
})
