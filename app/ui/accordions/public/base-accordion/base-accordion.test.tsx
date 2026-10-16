import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { BaseAccordion } from './base-accordion.tsx'

const ITEMS = [
  { value: 'drink', label: 'カテゴリ', content: <p>カテゴリの中身</p> },
  { value: 'taste', label: '味わい', content: <p>味わいの中身</p> },
]

const triggers = (html: string) => [...html.matchAll(/<button [^>]*>/g)].map(([tag]) => tag)
const panels = (html: string) =>
  [...html.matchAll(/<div [^>]*aria-labelledby[^>]*>/g)].map(([tag]) => tag)

describe('BaseAccordion', () => {
  it('starts closed, with aria-expanded="false" and closed panels', async () => {
    const html = await renderToString(<BaseAccordion items={ITEMS} />)

    // 0.12.1 leaves aria-expanded out while closed.
    for (const tag of triggers(html)) assert.match(tag, /aria-expanded="false"/)
    for (const tag of panels(html)) assert.match(tag, /data-state="closed"/)
  })

  it('opens the items it is given, with aria-expanded="true" rather than a bare attribute', async () => {
    const html = await renderToString(<BaseAccordion items={ITEMS} defaultValue={['taste']} />)
    const [drink, taste] = triggers(html)
    const [drinkPanel, tastePanel] = panels(html)

    assert.match(drink!, /aria-expanded="false"/)
    assert.match(taste!, /aria-expanded="true"/)
    assert.match(drinkPanel!, /data-state="closed"/)
    assert.match(tastePanel!, /data-state="open"/)
  })

  it('hides closed panels with CSS only, so they can be shown without script', async () => {
    const html = await renderToString(<BaseAccordion items={ITEMS} />)

    // The primitive would put `inert` and `aria-hidden` on a closed panel, and
    // either would leave it unusable where no script can open it.
    for (const tag of panels(html)) assert.doesNotMatch(tag, / hidden[ >=]| inert[ >=]|aria-hidden/)
    assert.match(html, /\[data-state="closed"\][^{]*\{\s*display:\s*none/)
    assert.match(
      html,
      /@media \(scripting: none\)[^@]*\[data-state="closed"\][^{]*\{\s*display:\s*block/
    )
  })

  it('links each trigger to its panel', async () => {
    const html = await renderToString(<BaseAccordion items={ITEMS} />)
    const [trigger] = triggers(html)
    const [panel] = panels(html)
    const controls = /aria-controls="([^"]+)"/.exec(trigger!)?.[1]

    assert.ok(controls)
    assert.match(panel!, new RegExp(`id="${controls}"`))
  })
})
