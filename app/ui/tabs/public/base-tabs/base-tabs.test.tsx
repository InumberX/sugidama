import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { BaseTabs } from './base-tabs.tsx'

const ITEMS = [
  { value: 'drink', label: 'カテゴリ', content: <p>カテゴリの中身</p> },
  { value: 'taste', label: '味わい', content: <p>味わいの中身</p> },
]

describe('BaseTabs', () => {
  it('renders a named tab list with the first tab selected and the rest of the panels hidden', async () => {
    const html = await renderToString(<BaseTabs label="検索条件" items={ITEMS} />)

    assert.match(html, /<div aria-label="検索条件"[^>]* role="tablist">/)
    assert.match(
      html,
      /<button type="button"[^>]* aria-selected="true"[^>]* role="tab"[^>]*>カテゴリ</
    )
    assert.match(
      html,
      /<button type="button"[^>]* aria-selected="false"[^>]* role="tab" tabindex="-1">味わい</
    )
    assert.match(html, /role="tabpanel">\s*<p>カテゴリの中身/)
    assert.match(html, /hidden [^>]*inert role="tabpanel"><p>味わいの中身/)
  })

  it('starts on the tab it is given', async () => {
    const html = await renderToString(
      <BaseTabs label="検索条件" items={ITEMS} defaultValue="taste" />
    )

    assert.match(html, /aria-selected="true"[^>]* role="tab"[^>]*>味わい</)
  })
})
