import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { BaseTabs, nextTabIndex } from './base-tabs.tsx'

const ITEMS = [
  { value: 'drink', label: 'カテゴリ', content: <p>カテゴリの中身</p> },
  { value: 'taste', label: '味わい', content: <p>味わいの中身</p> },
]

const tabs = (html: string) => [...html.matchAll(/<button [^>]*>/g)].map(([tag]) => tag)
const panels = (html: string) =>
  [...html.matchAll(/<div [^>]*role="tabpanel"[^>]*>/g)].map(([tag]) => tag)
const attr = (tag: string, name: string) => new RegExp(` ${name}="([^"]*)"`).exec(tag)?.[1]

describe('BaseTabs', () => {
  it('renders a named tab list with the first tab selected and the other panels hidden', async () => {
    const html = await renderToString(<BaseTabs label="検索条件" items={ITEMS} />)
    const [drink, taste] = tabs(html)
    const [drinkPanel, tastePanel] = panels(html)

    const list = /<div [^>]*role="tablist"[^>]*>/.exec(html)?.[0]
    assert.equal(attr(list ?? '', 'aria-label'), '検索条件')
    assert.equal(attr(drink!, 'aria-selected'), 'true')
    assert.equal(attr(drink!, 'tabindex'), '0')
    assert.equal(attr(taste!, 'aria-selected'), 'false')
    assert.equal(attr(taste!, 'tabindex'), '-1')
    assert.doesNotMatch(drinkPanel!, / hidden[ >]/)
    assert.match(tastePanel!, / hidden[ >]/)
  })

  it('links each tab to its panel', async () => {
    const html = await renderToString(<BaseTabs label="検索条件" items={ITEMS} />)

    tabs(html).forEach((tab, i) => {
      const panel = panels(html)[i]!
      assert.equal(attr(tab, 'aria-controls'), attr(panel, 'id'))
      assert.equal(attr(panel, 'aria-labelledby'), attr(tab, 'id'))
    })
  })

  it('starts on the tab it is given', async () => {
    const html = await renderToString(
      <BaseTabs label="検索条件" items={ITEMS} defaultValue="taste" />
    )

    assert.equal(attr(tabs(html)[1]!, 'aria-selected'), 'true')
    assert.match(panels(html)[0]!, / hidden[ >]/)
  })
})

describe('nextTabIndex', () => {
  it('moves with the arrow keys, wrapping at either end', () => {
    assert.equal(nextTabIndex('ArrowRight', 0, 3), 1)
    assert.equal(nextTabIndex('ArrowRight', 2, 3), 0)
    assert.equal(nextTabIndex('ArrowLeft', 0, 3), 2)
  })

  it('jumps with Home and End, and ignores every other key', () => {
    assert.equal(nextTabIndex('Home', 2, 3), 0)
    assert.equal(nextTabIndex('End', 0, 3), 2)
    assert.equal(nextTabIndex('Enter', 1, 3), null)
    assert.equal(nextTabIndex('ArrowDown', 1, 3), null)
  })
})
