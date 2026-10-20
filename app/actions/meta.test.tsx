import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { SITE_NAME, SITE_URL } from '../env.ts'
import { absoluteUrl, renderMeta, resolveTitle } from './meta.tsx'

const url = new URL('http://localhost/drinks/%6Bubota')

describe('resolveTitle', () => {
  it('names the site and its note in each language when the page has no title', () => {
    assert.equal(resolveTitle({}, 'ja'), `${SITE_NAME} | お酒の銘柄、製造元、味わいを紹介`)
    assert.equal(resolveTitle({}, 'en'), `${SITE_NAME} | Brand, Manufacturer, and Taste of Sake`)
  })

  it('puts the page title first', () => {
    assert.equal(resolveTitle({ title: '久保田' }, 'ja'), `久保田 | ${SITE_NAME}`)
  })

  it('uses an overridden site name in both forms, as og:site_name does', () => {
    assert.match(resolveTitle({ siteName: 'X' }, 'ja'), /^X \| /)
    assert.equal(resolveTitle({ title: 'a', siteName: 'X' }, 'ja'), 'a | X')
  })
})

describe('renderMeta', () => {
  it('describes the site in the page language by default', async () => {
    const en = await renderToString(<>{renderMeta({}, url, 'en')}</>)

    assert.match(en, /<meta name="description" content="This site is a personal archive/)
  })

  it('makes og:url the canonical URL', async () => {
    const html = await renderToString(<>{renderMeta({ canonical: '/drinks/kubota' }, url, 'ja')}</>)

    assert.match(html, new RegExp(`<link rel="canonical" href="${SITE_URL}/drinks/kubota"`))
    assert.match(html, new RegExp(`<meta property="og:url" content="${SITE_URL}/drinks/kubota"`))
  })

  it('never resolves the request path to another site', async () => {
    const html = await renderToString(
      <>{renderMeta({}, new URL('http://localhost//evil.example/x'), 'ja')}</>
    )

    assert.doesNotMatch(html, /href="https?:\/\/evil\.example/)
  })
})

describe('absoluteUrl', () => {
  it('resolves like an href', () => {
    assert.equal(absoluteUrl('https://cdn.example/a.webp'), 'https://cdn.example/a.webp')
    assert.equal(absoluteUrl('/a'), `${SITE_URL}/a`)
    assert.equal(absoluteUrl('a'), `${SITE_URL}/a`)
    // Unparseable: left as it came, rather than throwing mid-render.
    assert.equal(absoluteUrl('http://exa mple/x'), 'http://exa mple/x')
    assert.equal(
      absoluteUrl('//cdn.example/a.webp'),
      `${new URL(SITE_URL).protocol}//cdn.example/a.webp`
    )
  })
})
