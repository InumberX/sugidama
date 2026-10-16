import * as assert from 'remix/assert'
import { on } from 'remix/component'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { PrimitiveButton } from './primitive-button.tsx'

describe('PrimitiveButton', () => {
  it('takes an element hidden from assistive technology out of the tab order', async () => {
    for (const html of [
      await renderToString(<PrimitiveButton url="/a" ariaHidden tabIndex={0} />),
      await renderToString(<PrimitiveButton buttonType="button" ariaHidden />),
    ]) {
      assert.match(html, /aria-hidden="true"/)
      assert.match(html, /tabindex="-1"/)
    }
  })

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
      '/\\evil.example',
      '/\t/evil.example',
      '/\n/evil.example',
    ]) {
      const html = await renderToString(<PrimitiveButton url={url}>Link</PrimitiveButton>)
      assert.match(html, /data-rmx-document/, url)
    }
  })

  it('keeps client navigation for a root-relative path and a query', async () => {
    for (const url of ['/drinks', '?page=2']) {
      const html = await renderToString(<PrimitiveButton url={url}>Link</PrimitiveButton>)
      assert.doesNotMatch(html, /data-rmx-document/, url)
    }
  })

  it('treats an empty url as a link, not as the inert tag', async () => {
    const html = await renderToString(<PrimitiveButton url="">Here</PrimitiveButton>)

    assert.match(html, /<a[^>]*href=""/)
  })

  it('keeps the disabled treatment over a caller recipe that sets cursor', async () => {
    const html = await renderToString(
      <PrimitiveButton buttonType="button" isDisabled styleOverrides={{ cursor: 'pointer' }}>
        Nope
      </PrimitiveButton>
    )

    assert.match(html, /cursor: not-allowed/)
    assert.doesNotMatch(html, /cursor: pointer/)
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

  it('makes the caller choose the element: url, buttonType or nonClickableTag', () => {
    // Type-level only, checked by `npm run typecheck`: each directive fails the
    // build if its line ever stops being an error.
    // @ts-expect-error -- neither a link, a button nor an inert tag
    void (<PrimitiveButton />)
    // @ts-expect-error -- a link and a button at once
    void (<PrimitiveButton url="/x" buttonType="button" />)
    // @ts-expect-error -- a button and an inert tag at once
    void (<PrimitiveButton buttonType="button" nonClickableTag="span" />)
  })

  it('keeps the caller role and ARIA state on a disabled link', async () => {
    const html = await renderToString(
      <PrimitiveButton
        url="/tab-2"
        role="tab"
        ariaControls="panel-2"
        ariaSelected={false}
        isDisabled
      >
        Tab 2
      </PrimitiveButton>
    )

    assert.match(html, /role="tab"/)
    assert.match(html, /aria-controls="panel-2"/)
    assert.match(html, /aria-disabled="true"/)
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
