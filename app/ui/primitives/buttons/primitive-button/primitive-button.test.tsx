import * as assert from 'remix/assert'
import { on } from 'remix/component'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { PrimitiveButton } from './primitive-button.tsx'

describe('PrimitiveButton', () => {
  it('renders an enhanced anchor for an internal url', async () => {
    const html = await renderToString(<PrimitiveButton url="/books">Books</PrimitiveButton>)

    assert.match(html, /<a[^>]*href="\/books"/)
    assert.doesNotMatch(html, /data-rmx-document/)
  })

  it('opts out of client navigation for anything but a root-relative path', async () => {
    for (const url of [
      'https://remix.run',
      'http://example.com',
      '//example.com/x',
      'mailto:hello@example.com',
      'tel:0312345678',
      '#top',
    ]) {
      const html = await renderToString(<PrimitiveButton url={url}>Link</PrimitiveButton>)
      assert.match(html, /data-rmx-document/, url)
    }
  })

  it('renders a disabled link without href, so the keyboard cannot follow it', async () => {
    const html = await renderToString(
      <PrimitiveButton url="/books" isDisabled tabIndex={0}>
        Books
      </PrimitiveButton>
    )

    assert.match(html, /<a[^>]*aria-disabled="true"/)
    assert.match(html, /role="link"/)
    assert.doesNotMatch(html, /href=/)
    assert.doesNotMatch(html, /tabindex/i)
  })

  it('renders a button when buttonType is given', async () => {
    const html = await renderToString(
      <PrimitiveButton buttonType="submit" name="intent" value="save">
        Save
      </PrimitiveButton>
    )

    assert.match(html, /<button[^>]*type="submit"/)
    assert.match(html, /name="intent"/)
  })

  it('renders a button by default, so a click handler in mix gets one', async () => {
    const plain = await renderToString(<PrimitiveButton>Label</PrimitiveButton>)
    const clickable = await renderToString(
      <PrimitiveButton mix={on('click', () => {})}>Click</PrimitiveButton>
    )

    assert.match(plain, /<button[^>]*type="button"/)
    assert.match(clickable, /<button[^>]*type="button"/)
  })

  it('renders the named inert tag, passing tabIndex through', async () => {
    const span = await renderToString(
      <PrimitiveButton nonClickableTag="span">Label</PrimitiveButton>
    )
    const div = await renderToString(
      <PrimitiveButton nonClickableTag="div" tabIndex={0}>
        Label
      </PrimitiveButton>
    )

    assert.match(span, /<span/)
    assert.match(div, /<div[^>]*tabindex="0"/i)
  })

  it('marks a disabled button as disabled', async () => {
    const html = await renderToString(
      <PrimitiveButton buttonType="button" isDisabled>
        Nope
      </PrimitiveButton>
    )

    assert.match(html, /disabled/)
  })

  it('accepts composed behavior through mix', async () => {
    const html = await renderToString(
      <PrimitiveButton buttonType="button" mix={on('click', () => {})}>
        Click
      </PrimitiveButton>
    )

    assert.match(html, /<button/)
  })
})
