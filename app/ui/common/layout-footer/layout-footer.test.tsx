import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { getYearInJapan, LayoutFooter } from './layout-footer.tsx'

describe('LayoutFooter', () => {
  it('prints the copyright as untranslated English', async () => {
    const html = await renderToString(<LayoutFooter year={2024} />)

    assert.match(
      html,
      /<footer[^>]*>.*<small lang="en" translate="no"[^>]*>Copyright © 2024 N\/NE, All rights reserved\.<\/small>/
    )
  })

  it('defaults to the current year in Japan', async () => {
    // Either side of the render, so a run across New Year's midnight still passes.
    const before = getYearInJapan(new Date())
    const html = await renderToString(<LayoutFooter />)
    const after = getYearInJapan(new Date())

    assert.match(html, new RegExp(`Copyright © (${before}|${after}) `))
  })

  it('turns the year over at midnight in Japan, not in UTC', () => {
    // 2027-01-01 03:00 in Japan, still 2026 in UTC.
    assert.equal(getYearInJapan(new Date('2026-12-31T18:00:00Z')), 2027)
    assert.equal(getYearInJapan(new Date('2026-12-31T14:59:59Z')), 2026)
  })
})
