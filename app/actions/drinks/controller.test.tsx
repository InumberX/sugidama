import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { drinkDetailFixture, mockKuroco } from '../../../test/kuroco.ts'
import { router } from '../../router.ts'
import { routes } from '../../routes.ts'
import { toLangParam } from '../../utils/i18n.ts'

describe('drinks controller', () => {
  it('renders the drinks page in Japanese without a prefix', async (t) => {
    mockKuroco(t)
    const href = routes.drinks.index.href({ lang: toLangParam('ja') })
    const response = await router.fetch(new Request(`http://localhost${href}`))
    const html = await response.text()

    assert.equal(href, '/drinks')
    assert.equal(response.status, 200)
    assert.match(html, /<html lang="ja">/)
    assert.match(html, /<h1[^>]*><span[^>]*>お酒一覧<\/span><\/h1>/)
  })

  it('renders the drinks page in English under /en', async (t) => {
    mockKuroco(t)
    const href = routes.drinks.index.href({ lang: toLangParam('en') })
    const response = await router.fetch(new Request(`http://localhost${href}`))
    const html = await response.text()

    assert.equal(href, '/en/drinks')
    assert.match(html, /<html lang="en">/)
    assert.match(html, /<title>Drinks/)
    // The language switch leads back to the Japanese page.
    assert.match(html, /<a href="\/drinks"[^>]*><span[^>]*>JA<\/span>/)
  })

  it('redirects /ja/drinks and rejects an unknown language', async () => {
    const ja = await router.fetch(new Request('http://localhost/ja/drinks'))
    const fr = await router.fetch(new Request('http://localhost/fr/drinks'))

    assert.equal(ja.status, 302)
    assert.equal(ja.headers.get('Location'), '/drinks')
    assert.equal(fr.status, 404)
  })

  it('renders a drink under its slug', async (t) => {
    mockKuroco(t, { '/drinks/kubota': drinkDetailFixture() })
    const href = routes.drinks.show.href({ lang: toLangParam('en'), drinkId: 'kubota' })
    const response = await router.fetch(new Request(`http://localhost${href}`))

    assert.equal(href, '/en/drinks/kubota')
    assert.equal(response.status, 200)
    assert.match(await response.text(), /<html lang="en">/)
  })
})
