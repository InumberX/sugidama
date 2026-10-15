import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { ArticleCard } from './article-card.tsx'

describe('ArticleCard', () => {
  it('links the title, the description and the thumbnail to the card page', async () => {
    const html = await renderToString(
      <ArticleCard
        url="/drinks/sake"
        title={{ text: '日本酒' }}
        description={{ text: '2024/01/01' }}
        thumbnail={{ src: '/img/sake.webp', alt: '日本酒の瓶' }}
      />
    )

    assert.match(html, /<article data-article-card=""/)
    assert.match(
      html,
      /<h2 data-article-card-link=""[^>]*><a href="\/drinks\/sake"[^>]*>日本酒<\/a>/
    )
    assert.match(html, /<p data-article-card-link=""[^>]*><a href="\/drinks\/sake"/)
    assert.match(html, /<img src="\/img\/sake\.webp" alt="日本酒の瓶"/)
    assert.equal([...html.matchAll(/href="\/drinks\/sake"/g)].length, 3)
  })

  it('renders inert parts and no link markers without a url', async () => {
    const html = await renderToString(<ArticleCard title={{ text: 'A', titleTag: 'h3' }} />)

    assert.doesNotMatch(html, /<a\b/)
    assert.doesNotMatch(html, /data-article-card-link=""/)
    assert.match(html, /<h3[^>]*><span/)
  })

  it('keeps the thumbnail and the description at the top of their rows', async () => {
    const html = await renderToString(
      <ArticleCard url="/x" title={{ text: 'A' }} description={{ text: 'd' }} />
    )

    // Both links override the primitive reset's `align-items: center`.
    assert.equal([...html.matchAll(/align-items: flex-start/g)].length, 2)
  })

  it('falls back to the empty thumbnail', async () => {
    const html = await renderToString(<ArticleCard url="/x" title={{ text: 'A' }} />)

    assert.match(html, /<img src="\/assets\/img\/img-empty-16-9\.avif" alt=""/)
  })

  it('renders tags outlined unless they say otherwise, outside the card links', async () => {
    const html = await renderToString(
      <ArticleCard
        url="/x"
        title={{ text: 'A' }}
        tags={[{ url: '/drinks?drink=1', children: 'ビール' }]}
      />
    )

    assert.match(html, /<li[^>]*><a href="\/drinks\?drink=1"/)
    assert.match(html, /color: var\(--color-font-sub-dark\)/)
    // The tag's wrapper is not a card link, so hovering it leaves the title alone.
    assert.doesNotMatch(html, /<div data-article-card-link=""[^>]*><div[^>]*><ul/)
  })

  it('recolors the title and zooms the image while a card link is hovered', async () => {
    const html = await renderToString(<ArticleCard url="/x" title={{ text: 'A' }} />)

    const hover = /\[data-article-card\]:has\(\[data-article-card-link\] > a:hover\) &/g
    assert.equal([...html.matchAll(hover)].length, 2)
    assert.match(html, /scale: var\(--scale-hover\)/)
  })
})
