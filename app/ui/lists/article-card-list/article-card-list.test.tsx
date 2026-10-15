import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { ArticleCardList } from './article-card-list.tsx'

const items = [
  { url: '/drinks/a', title: { text: 'A' } },
  { url: '/drinks/b', title: { text: 'B' } },
]

describe('ArticleCardList', () => {
  it('lays the cards out in a grid of at least 300px cells by default', async () => {
    const html = await renderToString(<ArticleCardList items={items} />)

    assert.equal([...html.matchAll(/<article/g)].length, 2)
    assert.match(html, /minmax\(min\(300px, 100%\), 1fr\)/)
  })

  it('takes the small cell size', async () => {
    const html = await renderToString(<ArticleCardList items={items} itemSize="small" />)

    assert.match(html, /minmax\(min\(240px, 100%\), 1fr\)/)
  })

  it('goes to two columns from the sm container width', async () => {
    const html = await renderToString(<ArticleCardList items={items} itemSize="twoColumns" />)

    assert.match(html, /@container \(width >= 576px\)/)
    assert.match(html, /grid-template-columns: repeat\(2, 1fr\)/)
  })
})
