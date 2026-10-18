import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { drinkFixture, drinksFixture, mockKuroco } from '../../../../test/kuroco.ts'
import { router } from '../../../router.ts'
import { CLIENT_RUNTIME_URL } from '../../document.tsx'

const get = (path: string) => router.fetch(new Request(`http://localhost${path}`))

const drinksRequest = (fetch: ReturnType<typeof mockKuroco>) => {
  const call = fetch.mock.calls
    .map((c) => new URL(String(c.arguments[0])))
    .find((url) => url.pathname.endsWith('/drinks'))
  assert.ok(call, 'the drinks endpoint was requested')
  return call.searchParams
}

describe('drinks index page', () => {
  it('passes the search to the API', async (t) => {
    const fetch = mockKuroco(t, {
      '/drinks': { ...drinksFixture([drinkFixture()]), pageInfo: { totalCnt: 100 } },
    })
    const response = await get('/drinks?keyword=%E8%BE%9B&drink=2&taste=11&drinkability=21&page=3')
    const params = drinksRequest(fetch)

    assert.equal(response.status, 200)
    assert.equal(params.get('pageID'), '3')
    assert.equal(params.get('cnt'), '12')
    assert.equal(params.get('filter'), 'keyword contains "辛" AND drink_category = "2"')
    assert.deepEqual(params.getAll('tag_id'), ['11', '21'])
  })

  it('answers an invalid page with a 404', async (t) => {
    const fetch = mockKuroco(t)
    const response = await get('/drinks?page=0')

    assert.equal(response.status, 404)
    assert.equal(fetch.mock.calls.length, 0)
  })

  it('shows the selected conditions in the form', async (t) => {
    mockKuroco(t)
    const html = await (await get('/drinks?keyword=%E8%BE%9B&drink=2')).text()

    assert.match(html, /<input[^>]* name="keyword"[^>]* value="辛"/)
    assert.match(html, /<input[^>]* name="drink" value="2" checked[^>]*>/)
    assert.match(html, /<input[^>]* name="drink" value="1"(?! checked)[^>]*>/)
  })

  it('loads the client runtime for the search form', async (t) => {
    mockKuroco(t)
    const html = await (await get('/drinks')).text()

    assert.ok(html.includes(`src="${CLIENT_RUNTIME_URL}"`))
    assert.match(html, /"exportName":"SearchDrinksForm"/)
  })

  it('links every other page of the same search', async (t) => {
    const many = Array.from({ length: 12 }, (_, i) => drinkFixture({ topics_id: i, slug: `d${i}` }))
    mockKuroco(t, { '/drinks': { ...drinksFixture(many), pageInfo: { totalCnt: 30 } } })
    const html = await (await get('/drinks?taste=11&page=2')).text()

    assert.match(html, /<span aria-current="page"[^>]*>2<\/span>/)
    assert.match(html, /<a href="\/drinks\?taste=11#search-drinks-result"[^>]*>1<\/a>/)
    assert.match(html, /<a href="\/drinks\?taste=11&amp;page=3#search-drinks-result"[^>]*>3<\/a>/)
    assert.match(html, /aria-label="次のページへ"/)
  })

  it('answers a page past the last one with a 404, but not the first page of no results', async (t) => {
    const many = Array.from({ length: 12 }, (_, i) => drinkFixture({ topics_id: i, slug: `d${i}` }))
    mockKuroco(t, { '/drinks': { ...drinksFixture(many), pageInfo: { totalCnt: 24 } } })

    assert.equal((await get('/drinks?page=2')).status, 200)
    assert.equal((await get('/drinks?page=3')).status, 404)
  })

  it('says so when nothing matches', async (t) => {
    mockKuroco(t, { '/drinks': drinksFixture([]) })
    const html = await (await get('/drinks?keyword=none')).text()

    assert.match(html, /検索結果がありません。/)
    assert.doesNotMatch(html, /aria-label="ページ送り"/)
  })

  it('keeps the form when the search fails, and shows the error in place of the results', async (t) => {
    mockKuroco(t, { '/drinks': new Response('down', { status: 503 }) })
    const response = await get('/drinks')
    const html = await response.text()

    // The page still renders, but with the API's status: not cached or indexed as content.
    assert.equal(response.status, 503)
    assert.match(html, /role="alert"/)
    // Pagination links carry #search-drinks-result, so it has to exist here too.
    assert.match(html, /id="search-drinks-result"/)
    assert.match(html, /<form action="\/drinks" method="get"/)
  })

  it('answers an API client error with a 502, since the visitor did nothing wrong', async (t) => {
    mockKuroco(t, { '/drinks': new Response('denied', { status: 401 }) })
    t.mock.method(console, 'error', () => {})

    assert.equal((await get('/drinks')).status, 502)
  })

  it('answers a search that reached nothing with a 500, still rendering the form', async (t) => {
    mockKuroco(t, { '/drinks': new Error('connection lost') })
    t.mock.method(console, 'error', () => {})
    const response = await get('/drinks')

    assert.equal(response.status, 500)
    assert.match(await response.text(), /<form action="\/drinks" method="get"/)
  })

  it('redirects a malformed or unknown id to the same search without it', async (t) => {
    mockKuroco(t)
    const response = await get('/en/drinks?drink=99999&drink=2&taste=02&taste=11&taste=11&page=2')

    assert.equal(response.status, 302)
    assert.equal(response.headers.get('Location'), '/en/drinks?drink=2&taste=11&page=2')
  })

  it('keeps the parameters the page does not read across that redirect', async (t) => {
    mockKuroco(t)
    const response = await get('/drinks?utm_source=x&taste=abc&keyword=%E8%BE%9B')

    assert.equal(response.status, 302)
    assert.equal(response.headers.get('Location'), '/drinks?keyword=%E8%BE%9B&utm_source=x')
  })

  it('answers the redirected search with the page', async (t) => {
    mockKuroco(t)
    const response = await get('/drinks?drink=2&taste=11')

    assert.equal(response.status, 200)
  })

  it('answers with the API error when the conditions cannot be loaded', async (t) => {
    mockKuroco(t, { '/masters/drink_category': new Response('down', { status: 503 }) })
    const response = await get('/drinks')

    assert.equal(response.status, 503)
  })
})
