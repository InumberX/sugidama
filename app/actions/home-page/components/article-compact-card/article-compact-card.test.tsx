import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { ArticleCompactCard } from './article-compact-card.tsx'

describe('ArticleCompactCard', () => {
  it('keeps the thumbnail link from keyboards and screen readers, as a repeat of the title', async () => {
    const html = await renderToString(
      <ArticleCompactCard
        url="/drinks/sake"
        title={{ text: '日本酒' }}
        description={{ text: '2024/01/01' }}
      />
    )
    const links = [...html.matchAll(/<a href="\/drinks\/sake"[^>]*>/g)].map(([tag]) => tag)

    assert.equal(links.length, 3)
    assert.deepEqual(
      links.map((tag) => /aria-hidden="true"/.test(tag) && /tabindex="-1"/.test(tag)),
      [false, false, true]
    )
  })

  it('leaves an inert thumbnail and its alt text to screen readers', async () => {
    const html = await renderToString(
      <ArticleCompactCard title={{ text: 'A' }} thumbnail={{ src: '/img/a.webp', alt: 'Aの瓶' }} />
    )

    assert.doesNotMatch(html, /aria-hidden|tabindex/)
    assert.match(html, /alt="Aの瓶"/)
  })

  it('links the title, the description and the thumbnail to the card page', async () => {
    const html = await renderToString(
      <ArticleCompactCard
        url="/drinks/a"
        title={{ text: 'A', titleTag: 'h3' }}
        description={{ text: '2024/03/01' }}
      />
    )

    assert.match(html, /<article data-article-compact-card=""/)
    assert.match(html, /<h3 data-article-compact-card-link=""[^>]*><a href="\/drinks\/a"/)
    assert.equal([...html.matchAll(/href="\/drinks\/a"/g)].length, 3)
    assert.match(html, /<img src="\/assets\/img\/img-empty-16-9\.avif" alt=""/)
  })

  it("trims the title's padding next to a description and above tags", async () => {
    const plain = await renderToString(<ArticleCompactCard url="/a" title={{ text: 'A' }} />)
    const full = await renderToString(
      <ArticleCompactCard
        url="/a"
        title={{ text: 'A' }}
        description={{ text: 'd' }}
        tags={[{ url: '/drinks?drink=1', children: 'ビール' }]}
      />
    )

    assert.doesNotMatch(plain, /padding-block-start: 4px/)
    assert.doesNotMatch(plain, /padding-block-end: 0/)
    assert.match(full, /padding-block-start: 4px/)
    assert.match(full, /padding-block-end: 0/)
  })

  it('recolors the title and zooms the image while one of its links is hovered', async () => {
    const html = await renderToString(<ArticleCompactCard url="/a" title={{ text: 'A' }} />)

    const hover =
      /\[data-article-compact-card\]:has\(\[data-article-compact-card-link\] > a:hover\) &/g
    assert.equal([...html.matchAll(hover)].length, 2)
  })
})
