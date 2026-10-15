import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { DEFAULT_LANG, defineMessages, isLang, LANGS, toLangParam } from './i18n.ts'

describe('i18n', () => {
  it('publishes Japanese as the default and English', () => {
    assert.deepEqual([...LANGS], ['ja', 'en'])
    assert.equal(DEFAULT_LANG, 'ja')
  })

  it('recognizes only the published languages, case-sensitively', () => {
    assert.ok(isLang('ja'))
    assert.ok(isLang('en'))
    assert.ok(!isLang('EN'))
    assert.ok(!isLang('fr'))
    assert.ok(!isLang(''))
  })

  it('leaves the default language out of the route param', () => {
    assert.equal(toLangParam('ja'), undefined)
    assert.equal(toLangParam('en'), 'en')
  })

  it('returns each language its own messages, interpolation included', () => {
    const messages = defineMessages({
      ja: { title: '新着のお酒', related: (category: string) => `${category}のお酒` },
      en: { title: 'New Arrivals', related: (category: string) => `${category} Drinks` },
    })

    assert.equal(messages.ja.title, '新着のお酒')
    assert.equal(messages.en.related('Sake'), 'Sake Drinks')
  })

  it('rejects a language whose messages differ in shape (type-level)', () => {
    // Each case is checked by `npm run typecheck`: the directive fails the
    // build if the line ever stops being an error.
    defineMessages({
      ja: { title: 'タイトル', lead: 'リード' },
      // @ts-expect-error -- `lead` is missing
      en: { title: 'Title' },
    })
    defineMessages({
      ja: { title: 'タイトル' },
      // @ts-expect-error -- `titel` is not a key the Japanese messages declare
      en: { title: 'Title', titel: 'Typo' },
    })
    defineMessages({
      ja: { related: (category: string) => `${category}のお酒` },
      // @ts-expect-error -- a message that interpolates must stay a function
      en: { related: 'Drinks' },
    })
    // @ts-expect-error -- every published language is required
    defineMessages({ ja: { title: 'タイトル' } })
  })
})
