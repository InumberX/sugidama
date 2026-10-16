import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { CardLink } from './card-link.tsx'

describe('CardLink', () => {
  it('links to the card page, or renders an inert span without one', async () => {
    const link = await renderToString(
      <CardLink url="/drinks/a" styleOverrides={{}}>
        A
      </CardLink>
    )
    const inert = await renderToString(<CardLink styleOverrides={{}}>A</CardLink>)

    assert.match(link, /<a href="\/drinks\/a"/)
    assert.match(inert, /<span[^>]*>A<\/span>/)
  })

  it('takes a redundant link out of the tab order and the accessibility tree', async () => {
    const html = await renderToString(
      <CardLink url="/drinks/a" styleOverrides={{}} isRedundant>
        A
      </CardLink>
    )

    assert.match(html, /tabindex="-1"/)
    assert.match(html, /aria-hidden="true"/)
  })

  it('leaves an inert part alone even when marked redundant', async () => {
    const html = await renderToString(
      <CardLink styleOverrides={{}} isRedundant>
        A
      </CardLink>
    )

    assert.doesNotMatch(html, /aria-hidden|tabindex/)
  })
})
