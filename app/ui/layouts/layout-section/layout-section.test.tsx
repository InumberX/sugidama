import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { getClampPx } from '../../styles/public/mixins.ts'
import { LayoutSection } from './layout-section.tsx'

describe('LayoutSection', () => {
  it('renders a section with medium space above and below by default', async () => {
    const html = await renderToString(<LayoutSection>x</LayoutSection>)

    assert.match(html, /<\/head><section/)
    assert.ok(html.includes(`padding-block-start: ${getClampPx(40, 80)}`))
    assert.ok(html.includes(`padding-block-end: ${getClampPx(40, 80)}`))
  })

  it('sets each side independently', async () => {
    const html = await renderToString(
      <LayoutSection tag="div" topSpace="none" bottomSpace="small">
        x
      </LayoutSection>
    )

    assert.match(html, /<\/head><div/)
    assert.match(html, /padding-block-start: 0/)
    assert.ok(html.includes(`padding-block-end: ${getClampPx(24, 40)}`))
  })
})
