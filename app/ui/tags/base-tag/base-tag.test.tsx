import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { BaseTag } from './base-tag.tsx'

/** The class on the host element: the first tag after the collected styles. */
const hostClassOf = (html: string) => {
  const match = /<\/head><\w+[^>]*class="([^"]+)"/.exec(html)
  if (!match) throw new Error(`no host element in ${html}`)
  return match[1]
}

describe('BaseTag', () => {
  it('renders a link, merged with the primitive into one host class', async () => {
    const html = await renderToString(<BaseTag url="/drinks?drink=1">ビール</BaseTag>)

    assert.match(html, /<a[^>]*href="\/drinks\?drink=1"/)
    assert.equal(hostClassOf(html).split(' ').length, 1)
    assert.match(html, /border-radius: calc\(infinity \* 1px\)/)
  })

  it('colors each variant from the color lookup', async () => {
    const contained = await renderToString(<BaseTag nonClickableTag="span">a</BaseTag>)
    const outlined = await renderToString(
      <BaseTag nonClickableTag="span" variant="outlined">
        a
      </BaseTag>
    )

    assert.match(contained, /background-color: var\(--color-background-sub-dark\)/)
    assert.match(contained, /color: var\(--color-font-light\)/)
    assert.doesNotMatch(outlined, /background-color: var\(--color-background-sub-dark\)/)
    assert.match(outlined, /color: var\(--color-font-sub-dark\)/)
  })

  it('reacts to hover only as a link or a button', async () => {
    const link = await renderToString(<BaseTag url="/">a</BaseTag>)
    const button = await renderToString(<BaseTag buttonType="button">a</BaseTag>)
    const inert = await renderToString(<BaseTag nonClickableTag="span">a</BaseTag>)

    assert.match(link, /:hover/)
    assert.match(button, /:hover/)
    assert.doesNotMatch(inert, /:hover/)
  })

  it('dims when disabled and keeps the primitive disabled treatment', async () => {
    const html = await renderToString(
      <BaseTag url="/" isDisabled>
        a
      </BaseTag>
    )

    assert.match(html, /opacity: var\(--opacity-disabled\)/)
    assert.match(html, /cursor: not-allowed/)
    assert.doesNotMatch(html, /href=/)
  })
})
