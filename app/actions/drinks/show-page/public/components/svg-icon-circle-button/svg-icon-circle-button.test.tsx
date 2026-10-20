import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { SvgIconCircleButton } from './svg-icon-circle-button.tsx'

describe('SvgIconCircleButton', () => {
  it('is named by its title, with the icon itself hidden', async () => {
    const html = await renderToString(
      <SvgIconCircleButton buttonType="button" title="次へ" icon="keyboardArrowRight" />
    )

    assert.match(html, /<button type="button"[^>]*aria-label="次へ"/)
    assert.match(html, /<i aria-hidden="true"/)
  })

  it('is dimmed and inert when disabled', async () => {
    const html = await renderToString(
      <SvgIconCircleButton buttonType="button" title="次へ" icon="keyboardArrowRight" isDisabled />
    )

    assert.match(html, /<button[^>]* disabled/)
    assert.match(html, /opacity:\s*var\(--opacity-disabled\)/)
  })
})
