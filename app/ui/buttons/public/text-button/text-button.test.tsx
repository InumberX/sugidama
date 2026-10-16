import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { TextButton } from './text-button.tsx'

describe('TextButton', () => {
  it('renders a link in the primary color at medium size by default', async () => {
    const html = await renderToString(<TextButton url="/drinks">一覧へ</TextButton>)

    assert.match(html, /<a[^>]*href="\/drinks"/)
    assert.equal([...html.matchAll(/<a[^>]*class="([^"]+)"/g)][0]?.[1].split(' ').length, 1)
    assert.match(html, /color: var\(--color-font-primary\)/)
    assert.match(html, /font-size: clamp\(0\.875rem/)
    assert.match(html, /text-decoration: underline/)
  })

  it('takes a size and a color', async () => {
    const html = await renderToString(
      <TextButton buttonType="button" size="small" color="subDark">
        クリア
      </TextButton>
    )

    assert.match(html, /<button[^>]*type="button"/)
    assert.match(html, /color: var\(--color-font-sub-dark\)/)
    assert.match(html, /font-size: clamp\(0\.75rem/)
  })

  it('dims when disabled', async () => {
    const html = await renderToString(
      <TextButton buttonType="button" isDisabled>
        a
      </TextButton>
    )

    assert.match(html, /opacity: var\(--opacity-disabled\)/)
    assert.match(html, /cursor: not-allowed/)
  })
})
