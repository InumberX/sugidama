import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { BaseTagList } from './base-tag-list.tsx'

const items = [
  { url: '/drinks?drink=1', children: 'ビール' },
  { url: '/drinks?tag=2', children: '辛口' },
]

describe('BaseTagList', () => {
  it('renders a list of tag links', async () => {
    const html = await renderToString(<BaseTagList items={items} />)

    assert.match(html, /<div[^>]*><ul[^>]*><li[^>]*><a[^>]*href="\/drinks\?drink=1"/)
    assert.equal([...html.matchAll(/<li/g)].length, 2)
    assert.match(html, /justify-content: flex-start/)
  })

  it('renders spans when it must sit inside phrasing content', async () => {
    const html = await renderToString(
      <BaseTagList isNotSemantic items={[{ nonClickableTag: 'span', children: 'ビール' }]} />
    )

    assert.doesNotMatch(html, /<(ul|li|div)\b/)
    assert.match(html, /<span[^>]*><span[^>]*><span/)
  })

  it('aligns the row', async () => {
    const html = await renderToString(<BaseTagList items={items} align="right" />)

    assert.match(html, /justify-content: flex-end/)
  })

  it('accepts only inert tags when not semantic (type-level)', () => {
    const render = () => (
      // @ts-expect-error: a link tag would nest an <a> inside the link around the list
      <BaseTagList isNotSemantic items={[{ url: '/drinks?tag=1', children: '辛口' }]} />
    )
    assert.equal(typeof render, 'function')
  })
})
