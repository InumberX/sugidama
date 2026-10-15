import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { LayoutFooter } from './layout-footer.tsx'

describe('LayoutFooter', () => {
  it('prints the copyright as untranslated English', async () => {
    const html = await renderToString(<LayoutFooter year={2024} />)

    assert.match(
      html,
      /<footer[^>]*>.*<small lang="en" translate="no"[^>]*>Copyright © 2024 N\/NE, All rights reserved\.<\/small>/
    )
  })

  it('defaults to the current year', async () => {
    const html = await renderToString(<LayoutFooter />)

    assert.match(html, new RegExp(`Copyright © ${new Date().getFullYear()} `))
  })
})
