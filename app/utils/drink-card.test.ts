import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { drinkFixture } from '../../test/kuroco.ts'
import { toDrinkCardProps } from './drink-card.ts'

const categories = [
  { id: 1, label: 'ビール', slug: 'beer' },
  { id: 2, label: '日本酒', slug: 'sake' },
]
const tagGroups = [
  {
    name: 'taste' as const,
    terms: [
      { id: 11, label: '辛口' },
      { id: 12, label: '甘口' },
    ],
  },
  { name: 'drinkability' as const, terms: [{ id: 21, label: '飲みやすい' }] },
]

describe('toDrinkCardProps', () => {
  it("links to the drink's page by slug, with its title, date and thumbnail", () => {
    const card = toDrinkCardProps({ drink: drinkFixture(), lang: 'ja', categories, tagGroups })

    assert.equal(card.url, '/drinks/kubota')
    assert.equal(card.title.text, '久保田')
    assert.equal(card.description?.text, '2024/03/01')
    assert.deepEqual(card.thumbnail, { src: 'https://example.com/kubota.webp', alt: '久保田の瓶' })
  })

  it('falls back to topics_id without a slug, and to no thumbnail without an image', () => {
    const card = toDrinkCardProps({
      drink: drinkFixture({ slug: '', thumbnail: '' }),
      lang: 'ja',
      categories,
      tagGroups,
    })

    assert.equal(card.url, '/drinks/100')
    assert.equal(card.thumbnail, undefined)
  })

  it('tags the category first, then each matching tag, each linking to the filtered list', () => {
    const card = toDrinkCardProps({
      drink: drinkFixture({
        tags: [
          { tag_id: 21, tag_nm: '' },
          { tag_id: 11, tag_nm: '' },
        ],
      }),
      lang: 'ja',
      categories,
      tagGroups,
    })

    assert.deepEqual(card.tags, [
      { url: '/drinks?drink=2', children: '日本酒' },
      { url: '/drinks?taste=11', children: '辛口' },
      { url: '/drinks?drinkability=21', children: '飲みやすい' },
    ])
  })

  it('sets the title heading level when asked, and leaves it to the card otherwise', () => {
    const drink = drinkFixture()
    const card = toDrinkCardProps({ drink, lang: 'ja', categories, tagGroups, titleTag: 'h3' })

    assert.equal(card.title.titleTag, 'h3')
    assert.equal(
      toDrinkCardProps({ drink, lang: 'ja', categories, tagGroups }).title.titleTag,
      undefined
    )
  })

  it('leaves the date row out when the date cannot be read', () => {
    const card = toDrinkCardProps({
      drink: drinkFixture({ inst_ymdhi: '' }),
      lang: 'ja',
      categories,
      tagGroups,
    })

    assert.equal(card.description, undefined)
  })

  it('survives a drink with no category and no tags', () => {
    for (const drink_category of [null, ''] as const) {
      const card = toDrinkCardProps({
        drink: drinkFixture({ drink_category, tags: null }),
        lang: 'ja',
        categories,
        tagGroups,
      })
      assert.deepEqual(card.tags, [])
    }
  })

  it('uses the English title, date and URLs in English', () => {
    const card = toDrinkCardProps({ drink: drinkFixture(), lang: 'en', categories, tagGroups })

    assert.equal(card.url, '/en/drinks/kubota')
    assert.equal(card.title.text, 'Kubota')
    assert.equal(card.description?.text, 'March 1, 2024')
    assert.equal(card.tags?.[0]?.url, '/en/drinks?drink=2')
  })
})
