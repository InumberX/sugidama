import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { LayoutPageWrapper } from './layout-page-wrapper.tsx'

const HEADER_OFFSET = /calc\(var\(--layout-header-height\) \+ var\(--layout-header-space\)\)/

describe('LayoutPageWrapper', () => {
  it('pads both ends by the header offset', async () => {
    const html = await renderToString(<LayoutPageWrapper>x</LayoutPageWrapper>)

    assert.match(html, new RegExp(`padding-block-start: ${HEADER_OFFSET.source}`))
    assert.match(html, new RegExp(`padding-block-end: ${HEADER_OFFSET.source}`))
  })

  it('drops only the top padding with isTopNoSpace', async () => {
    const html = await renderToString(<LayoutPageWrapper isTopNoSpace>x</LayoutPageWrapper>)

    assert.match(html, /padding-block-start: 0/)
    assert.match(html, new RegExp(`padding-block-end: ${HEADER_OFFSET.source}`))
  })

  it('drops only the bottom padding with isBottomNoSpace', async () => {
    const html = await renderToString(<LayoutPageWrapper isBottomNoSpace>x</LayoutPageWrapper>)

    assert.match(html, /padding-block-end: 0/)
    assert.match(html, new RegExp(`padding-block-start: ${HEADER_OFFSET.source}`))
  })
})
