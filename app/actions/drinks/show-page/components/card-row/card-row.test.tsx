import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { CardRow } from './card-row.tsx'

describe('CardRow', () => {
  it('renders nothing without cards', async () => {
    assert.equal(await renderToString(<CardRow title="新着のお酒" cards={[]} />), '')
  })

  it('titles the row with an h2', async () => {
    const html = await renderToString(
      <CardRow
        title="新着のお酒"
        cards={[{ url: '/drinks/a', title: { text: 'a', titleTag: 'h3' } }]}
      />
    )

    assert.match(html, /<h2[^>]*>新着のお酒<\/h2>/)
    assert.match(html, /<h3[^>]*>/)
  })
})
