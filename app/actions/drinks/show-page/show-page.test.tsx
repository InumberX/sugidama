import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { drinkDetailFixture, drinkFixture, mockKuroco } from '../../../../test/kuroco.ts'
import { router } from '../../../router.ts'
import { CLIENT_RUNTIME_URL } from '../../document.tsx'

const get = (path: string) => router.fetch(new Request(`http://localhost${path}`))

const image = (name: string) => ({
  id: name,
  url: `https://example.com/${name}.webp`,
  desc: '',
  url_org: '',
})

const kubota = drinkFixture({
  main_visuals: [
    { main_visual_image: image('a'), main_visual_title: '瓶', main_visual_title_en: 'Bottle' },
    { main_visual_image: image('b'), main_visual_title: 'ラベル', main_visual_title_en: 'Label' },
  ],
  comment: '一行目\n二行目',
  comment_en: 'Line one',
  links: [
    {
      link_text: '公式',
      link_text_en: 'Official',
      link_url: 'https://a.example/',
      link_url_en: 'https://a.example/en',
    },
    { link_text: '', link_text_en: '', link_url: 'https://b.example/', link_url_en: '' },
  ],
})

describe('drink page', () => {
  it('renders the drink with its facts, tags and meta', async (t) => {
    mockKuroco(t, { '/drinks/kubota': drinkDetailFixture(kubota) })
    const response = await get('/drinks/kubota')
    const html = await response.text()

    assert.equal(response.status, 200)
    assert.match(html, /<title>久保田 \|/)
    assert.match(html, /<meta property="og:image" content="https:\/\/example\.com\/kubota\.webp"/)
    assert.match(html, /<h1[^>]*><span[^>]*>久保田<\/span><\/h1>/)
    assert.match(html, /<dt[^>]*>種類<\/dt><dd[^>]*>日本酒<\/dd>/)
    assert.match(html, /<dt[^>]*>アルコール度数<\/dt><dd[^>]*>15%<\/dd>/)
    assert.match(html, /一行目<br \/>二行目/)
    // A link without text is left out.
    assert.match(html, /href="https:\/\/a\.example\/"/)
    assert.doesNotMatch(html, /href="https:\/\/b\.example\/"/)
    assert.match(html, /href="\/drinks\?taste=11"/)
  })

  it('names the slug as canonical, whichever URL reached the drink', async (t) => {
    mockKuroco(t, {
      '/drinks/100': drinkDetailFixture(),
      '/drinks/kubota': drinkDetailFixture(),
    })

    for (const path of ['/drinks/100', '/drinks/%6Bubota', '/en/drinks/kubota']) {
      const html = await (await get(path)).text()
      const expected = path.startsWith('/en') ? '/en/drinks/kubota' : '/drinks/kubota'
      assert.match(html, new RegExp(`<link rel="canonical" href="[^"]*${expected}"`))
    }
  })

  it('names the topics_id as canonical for a drink without a slug', async (t) => {
    mockKuroco(t, { '/drinks/100': drinkDetailFixture(drinkFixture({ slug: '' })) })
    const html = await (await get('/drinks/100')).text()

    assert.match(html, /<link rel="canonical" href="[^"]*\/drinks\/100"/)
  })

  it('renders the English drink under /en', async (t) => {
    mockKuroco(t, { '/drinks/kubota': drinkDetailFixture(kubota) })
    const html = await (await get('/en/drinks/kubota')).text()

    assert.match(html, /<html lang="en"[ >]/)
    assert.match(html, /<h1[^>]*><span[^>]*>Kubota<\/span><\/h1>/)
    assert.match(html, /<dt[^>]*>Manufacturer<\/dt><dd[^>]*>Asahi Shuzo<\/dd>/)
    assert.match(html, /href="https:\/\/a\.example\/en"/)
    assert.match(html, /alt="Bottle"/)
    assert.match(html, /Sake Drinks<\/h2>/)
  })

  it('hydrates the slider, rendering each image once until it starts', async (t) => {
    mockKuroco(t, { '/drinks/kubota': drinkDetailFixture(kubota) })
    const html = await (await get('/drinks/kubota')).text()

    assert.ok(html.includes(`src="${CLIENT_RUNTIME_URL}"`))
    assert.match(html, /"exportName":"ArticleSlider"/)
    assert.equal(html.match(/<img src="https:\/\/example\.com\/a\.webp" alt="瓶"/g)?.length, 1)
    assert.match(html, /aria-label="2枚目の画像を表示"/)
  })

  it('leaves out an image row without an image, and survives missing lists', async (t) => {
    const unfinished = drinkFixture({
      main_visuals: [
        { main_visual_image: '', main_visual_title: '未設定', main_visual_title_en: '' },
        ...kubota.main_visuals!,
      ],
      links: null,
    })
    const bare = drinkFixture({ main_visuals: null, links: null })
    mockKuroco(t, {
      '/drinks/kubota': drinkDetailFixture(unfinished),
      '/drinks/bare': drinkDetailFixture(bare),
    })
    const response = await get('/drinks/kubota')
    const html = await response.text()

    assert.equal(response.status, 200)
    assert.doesNotMatch(html, /alt="未設定"/)
    // The first image keeps the first label: the empty row takes no number.
    assert.match(html, /aria-label="1枚目の画像を表示"/)
    assert.doesNotMatch(html, /3枚目の画像を表示/)
    assert.equal((await get('/drinks/bare')).status, 200)
  })

  it('ships no JavaScript for a drink with fewer than two images', async (t) => {
    const one = drinkFixture({ main_visuals: kubota.main_visuals!.slice(0, 1) })
    mockKuroco(t, {
      '/drinks/kubota': drinkDetailFixture(),
      '/drinks/one': drinkDetailFixture(one),
    })
    const none = await (await get('/drinks/kubota')).text()
    const single = await (await get('/drinks/one')).text()

    assert.ok(!none.includes(CLIENT_RUNTIME_URL))
    assert.ok(!single.includes(CLIENT_RUNTIME_URL))
    assert.doesNotMatch(single, /rmx-data/)
    assert.match(single, /<img src="https:\/\/example\.com\/a\.webp" alt="瓶"/)
  })

  it('asks for drinks of the same category and the newest, four each', async (t) => {
    const fetch = mockKuroco(t, { '/drinks/kubota': drinkDetailFixture() })
    const html = await (await get('/drinks/kubota')).text()
    const rows = fetch.mock.calls
      .map((c) => new URL(String(c.arguments[0])))
      .filter((url) => url.pathname.endsWith('/drinks'))
      .map((url) => url.searchParams)

    assert.deepEqual(rows.map((query) => [query.get('cnt'), query.get('filter')]).sort(), [
      ['4', null],
      ['4', 'drink_category = "2"'],
    ])
    assert.match(html, /日本酒のお酒<\/h2>/)
    assert.match(html, /新着のお酒<\/h2>/)
    assert.match(html, /<h3[^>]*>/)
    assert.match(html, /<a href="\/drinks"[^>]*>.*一覧に戻る/)
  })

  it('leaves out the related row for a drink without a known category', async (t) => {
    const fetch = mockKuroco(t, {
      '/drinks/kubota': drinkDetailFixture(drinkFixture({ drink_category: '' })),
    })
    const html = await (await get('/drinks/kubota')).text()

    assert.doesNotMatch(html, /のお酒<\/h2>(?<!新着のお酒<\/h2>)/)
    assert.equal(
      fetch.mock.calls.filter((c) => String(c.arguments[0]).includes('filter=')).length,
      0
    )
  })

  it('still renders the drink when the rows fail', async (t) => {
    t.mock.method(console, 'error', () => {})
    mockKuroco(t, {
      '/drinks/kubota': drinkDetailFixture(),
      '/drinks': new Response('', { status: 500 }),
    })
    const response = await get('/drinks/kubota')
    const html = await response.text()

    assert.equal(response.status, 200)
    assert.doesNotMatch(html, /<h2/)
    assert.match(html, /一覧に戻る/)
  })

  it("passes the API's 404 on, and fails with the vocabularies", async (t) => {
    t.mock.method(console, 'error', () => {})
    mockKuroco(t, {
      '/drinks/nope': new Response('', { status: 404 }),
      '/drinks/kubota': drinkDetailFixture(),
      '/tags/taste': new Response('', { status: 503 }),
    })

    assert.equal((await get('/drinks/nope')).status, 404)
    assert.equal((await get('/drinks/kubota')).status, 503)
  })

  it('answers a body without a drink as a 404', async (t) => {
    const empty = (details: unknown) => ({ errors: [], messages: [], details })
    mockKuroco(t, {
      '/drinks/a': empty(null),
      '/drinks/b': empty({}),
      '/drinks/c': empty([]),
    })

    for (const id of ['a', 'b', 'c']) assert.equal((await get(`/drinks/${id}`)).status, 404)
  })
})
