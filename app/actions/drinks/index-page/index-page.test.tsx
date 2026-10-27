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
    // Kuroco answers a pageID past the last with a 404 (the next test); this
    // covers the guard for a search that succeeds with fewer pages than asked
    // for, in case the API ever answers that way.
    const many = Array.from({ length: 12 }, (_, i) => drinkFixture({ topics_id: i, slug: `d${i}` }))
    mockKuroco(t, { '/drinks': { ...drinksFixture(many), pageInfo: { totalCnt: 24 } } })

    assert.equal((await get('/drinks?page=2')).status, 200)
    assert.equal((await get('/drinks?page=3')).status, 404)
  })

  it('answers a page past the last one with a 404 when Kuroco says so with its own 404', async (t) => {
    // What Kuroco answers a pageID past the last (measured on staging).
    const pageIdTooBig = () =>
      Response.json(
        { errors: [{ code: 'not_found', message: 'pageID is too big.' }] },
        { status: 404 }
      )
    mockKuroco(t, { '/drinks': pageIdTooBig() })
    t.mock.method(console, 'error', () => {})

    assert.equal((await get('/drinks?page=999')).status, 404)
    assert.equal((await get('/drinks?keyword=none&page=2')).status, 404)
  })

  it('answers the API 404 on the first page with a 502, as the endpoint is what is missing', async (t) => {
    // The first page is never past the last: a search with no results answers
    // it with an empty list (measured on staging), so a 404 there is the API's.
    mockKuroco(t, { '/drinks': new Response('gone', { status: 404 }) })
    t.mock.method(console, 'error', () => {})

    assert.equal((await get('/drinks')).status, 502)
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

  it('searches once, with only the known ids, and without redirecting', async (t) => {
    const fetch = mockKuroco(t)
    const response = await get('/en/drinks?drink=99999&drink=2&taste=02&taste=11&taste=11')
    const html = await response.text()
    const searches = fetch.mock.calls
      .map((c) => new URL(String(c.arguments[0])))
      .filter((url) => url.pathname.endsWith('/drinks'))
    const data = JSON.parse(
      /<script type="application\/json" id="rmx-data">(.*?)<\/script>/.exec(html)![1]!
    )
    const [entry] = Object.values(data.h) as {
      props: { conditions: { name: string; selected: string[] }[] }
    }[]
    const selected = Object.fromEntries(entry!.props.conditions.map((c) => [c.name, c.selected]))

    assert.equal(response.status, 200)
    assert.equal(searches.length, 1)
    assert.equal(searches[0]!.searchParams.get('filter'), 'drink_category = "2"')
    assert.deepEqual(searches[0]!.searchParams.getAll('tag_id'), ['11'])
    assert.deepEqual(selected.drink, ['2'])
    assert.deepEqual(selected.taste, ['11'])
  })

  it('keeps a known id however many unknown ones come before it', async (t) => {
    const fetch = mockKuroco(t)
    const junk = Array.from({ length: 60 }, (_, i) => `taste=${9000 + i}`).join('&')
    const response = await get(`/drinks?${junk}&taste=11`)
    const [search] = fetch.mock.calls
      .map((c) => new URL(String(c.arguments[0])))
      .filter((url) => url.pathname.endsWith('/drinks'))

    assert.equal(response.status, 200)
    assert.deepEqual(search!.searchParams.getAll('tag_id'), ['11'])
  })

  it('stops the keyword field at the longest keyword the list accepts', async (t) => {
    mockKuroco(t)
    const html = await (await get('/drinks')).text()

    assert.match(html, /<input type="text" id="search-drinks-keyword"[^>]*maxlength="100"/)
  })

  it('does not search when the conditions cannot be checked', async (t) => {
    const fetch = mockKuroco(t, { '/tags/taste': new Response('down', { status: 503 }) })
    const response = await get('/drinks?taste=11')
    const searches = fetch.mock.calls.filter((c) =>
      new URL(String(c.arguments[0])).pathname.endsWith('/drinks')
    )

    assert.equal(response.status, 503)
    assert.equal(searches.length, 0)
  })

  it('answers with the API error when the conditions cannot be loaded', async (t) => {
    mockKuroco(t, { '/masters/drink_category': new Response('down', { status: 503 }) })
    const response = await get('/drinks')

    assert.equal(response.status, 503)
  })
})
