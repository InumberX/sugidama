import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { PrimitiveButton } from '../../../primitives/buttons/public/primitive-button/primitive-button.tsx'
import { BaseButton } from './base-button.tsx'

/** The class on the host element: the first tag after the collected styles. */
const hostClassOf = (html: string) => {
  const match = /<\/head><\w+[^>]*class="([^"]+)"/.exec(html)
  if (!match) throw new Error(`no host element in ${html}`)
  return match[1]
}

describe('BaseButton over PrimitiveButton', () => {
  it('keeps the primitive element selection', async () => {
    assert.match(
      await renderToString(<BaseButton url="/books">Books</BaseButton>),
      /<a[^>]*href="\/books"/
    )
    assert.match(
      await renderToString(<BaseButton buttonType="submit">Save</BaseButton>),
      /<button[^>]*type="submit"/
    )
  })

  it('merges reset and styled recipe into a single host class', async () => {
    const html = await renderToString(<BaseButton buttonType="button">Go</BaseButton>)

    assert.equal(hostClassOf(html).split(' ').length, 1)
    // The styled tier's color won over the reset's `color: inherit`. It is a
    // custom property so the `util` layer can still override it.
    assert.match(html, /color: var\(--color-font-light\)/)
    assert.doesNotMatch(html, /color: inherit/)
  })

  it('merges a caller recipe last, under the disabled treatment', async () => {
    const html = await renderToString(
      <BaseButton
        buttonType="submit"
        isDisabled
        styleOverrides={{ inlineSize: '100%', cursor: 'pointer' }}
      >
        Save
      </BaseButton>
    )

    assert.equal(hostClassOf(html).split(' ').length, 1)
    assert.match(html, /inline-size: 100%/)
    assert.doesNotMatch(html, /inline-size: auto/)
    assert.match(html, /cursor: not-allowed/)
    assert.doesNotMatch(html, /cursor: pointer/)
  })

  it('draws the contained primary button as two stacked gradients', async () => {
    const html = await renderToString(<BaseButton buttonType="button">Go</BaseButton>)

    assert.match(html, /linear-gradient\(90deg, var\(--color-gradation-primary\)\)/)
    assert.match(html, /linear-gradient\(90deg, var\(--color-gradation-primary-dark\)\)/)
    assert.match(html, /:hover::before/)
  })

  it('outlines the primary color for the outlined variant', async () => {
    const html = await renderToString(
      <BaseButton buttonType="button" variant="outlined">
        Go
      </BaseButton>
    )

    assert.match(html, /border-color: var\(--color-border-primary\)/)
    assert.doesNotMatch(html, /linear-gradient/)
  })

  it('dims a disabled button', async () => {
    const enabled = await renderToString(<BaseButton buttonType="button">Go</BaseButton>)
    const disabled = await renderToString(
      <BaseButton buttonType="button" isDisabled>
        Go
      </BaseButton>
    )

    assert.doesNotMatch(enabled, /opacity: var\(--opacity-disabled\)/)
    assert.match(disabled, /opacity: var\(--opacity-disabled\)/)
    assert.match(disabled, /cursor: not-allowed/)
    assert.match(disabled, /<button[^>]*disabled/)
  })

  it('renders the elements on either side of the label', async () => {
    const html = await renderToString(
      <BaseButton buttonType="button" leftElm={<i>L</i>} rightElm={<i>R</i>}>
        Label
      </BaseButton>
    )

    assert.match(html, /<i>L<\/i><span[^>]*>Label<\/span><i>R<\/i>/)
  })

  it('leaves the primitive unstyled on its own', async () => {
    const html = await renderToString(<PrimitiveButton buttonType="button">Bare</PrimitiveButton>)

    assert.match(html, /color: inherit/)
    assert.match(html, /font: inherit/)
    assert.doesNotMatch(html, /var\(--color/) // no design tokens reach this tier
  })
})
