import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import {
  drinkFixture,
  drinksFixture,
  mockKuroco,
  newArrivalsFixture,
} from '../../../test/kuroco.ts'
import { router } from '../../router.ts'

const home = async (path = '/') => {
  const response = await router.fetch(new Request(`http://localhost${path}`))
  return { response, html: await response.text() }
}

describe('home page', () => {
  it('asks for the six newest drinks and the category and tag vocabularies', async (t) => {
    const fetch = mockKuroco(t)
    await home()

    const urls = fetch.mock.calls.map((call) => new URL(String(call.arguments[0])))
    const drinks = urls.find((url) => url.pathname.endsWith('/drinks'))
    assert.equal(drinks?.searchParams.get('cnt'), '6')
    assert.equal(drinks?.searchParams.get('pageID'), '1')
    assert.equal(drinks?.searchParams.get('order_query'), 'inst_ymdhi=DESC')
    assert.equal(urls.length, 4)
  })

  it('shows two large cards and four compact ones, titled as h3', async (t) => {
    mockKuroco(t)
    const { response, html } = await home()

    assert.equal(response.status, 200)
    assert.equal([...html.matchAll(/<article data-article-card=""/g)].length, 2)
    assert.equal([...html.matchAll(/<article data-article-compact-card=""/g)].length, 4)
    assert.match(html, /<h3 data-article-card-link=""[^>]*><a href="\/drinks\/drink-0"/)
    assert.match(html, /<h3 data-article-compact-card-link=""[^>]*><a href="\/drinks\/drink-5"/)
    assert.match(html, /新着のお酒/)
  })

  it('shows no more than four compact cards even if the API returns more', async (t) => {
    const many = Array.from({ length: 10 }, (_, i) => drinkFixture({ slug: `d${i}` }))
    mockKuroco(t, { '/drinks': drinksFixture(many) })
    const { html } = await home()

    assert.equal([...html.matchAll(/<article data-article-compact-card=""/g)].length, 4)
  })

  it('leaves the compact column out when there are only two drinks', async (t) => {
    mockKuroco(t, { '/drinks': drinksFixture([drinkFixture(), drinkFixture({ slug: 'b' })]) })
    const { html } = await home()

    assert.equal([...html.matchAll(/<article data-article-card=""/g)].length, 2)
    assert.doesNotMatch(html, /data-article-compact-card=""/)
  })

  it('links each category, in the master order, to the filtered list', async (t) => {
    mockKuroco(t)
    const { html } = await home()

    // Only the category links hold a <figure>; the cards' tags link the same way.
    const links = [
      ...html.matchAll(
        /<a href="(\/drinks\?drink=\d+)"[^>]*><div[^>]*><figure[^>]*>.*?<h3[^>]*>([^<]+)<\/h3>/g
      ),
    ]
    assert.deepEqual(
      links.map(([, href, label]) => [href, label]),
      [
        ['/drinks?drink=1', 'ビール'],
        ['/drinks?drink=2', '日本酒'],
      ]
    )
    assert.match(html, /src="\/assets\/img\/img-category-beer\.webp"/)
  })

  it('renders in English under /en, links included', async (t) => {
    mockKuroco(t)
    const { html } = await home('/en')

    assert.match(html, /New Arrivals/)
    assert.match(html, /<a href="\/en\/drinks\/drink-0"[^>]*>Drink 0<\/a>/)
    assert.match(html, /<a href="\/en\/drinks\?drink=1"/)
    assert.match(html, /March 1, 2024/)
  })

  it("passes the API's 5xx through, without the API's own words", async (t) => {
    t.mock.method(console, 'error', () => {})
    mockKuroco(t, { '/tags/taste': new Response(null, { status: 503, statusText: 'Down' }) })
    const { response, html } = await home()

    assert.equal(response.status, 503)
    assert.doesNotMatch(html, /Down/)
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff')
  })

  it('does not turn the home page into a 404 when an API endpoint is missing', async (t) => {
    t.mock.method(console, 'error', () => {})
    mockKuroco(t, { '/drinks': new Response(null, { status: 404 }) })
    const { response } = await home()

    assert.equal(response.status, 502)
  })

  it('answers 500 when the API cannot be reached', async (t) => {
    t.mock.method(console, 'error', () => {})
    mockKuroco(t, { '/drinks': new Error('connection refused') })
    const { response } = await home()

    assert.equal(response.status, 500)
  })

  it('keeps the newest-first order the API returns', async (t) => {
    mockKuroco(t)
    const { html } = await home()

    const order = [...html.matchAll(/href="\/drinks\/(drink-\d)"/g)].map(([, slug]) => slug)
    const unique = order.filter((slug, i) => order.indexOf(slug) === i)
    assert.deepEqual(
      unique,
      newArrivalsFixture.list.map((drink) => drink.slug)
    )
  })
})
