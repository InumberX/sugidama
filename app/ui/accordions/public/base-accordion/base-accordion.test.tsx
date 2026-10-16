import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { BaseAccordion } from './base-accordion.tsx'

const ITEMS = [
  { value: 'drink', label: 'カテゴリ', content: <p>カテゴリの中身</p> },
  { value: 'taste', label: '味わい', content: <p>味わいの中身</p> },
]

const details = (html: string) => [...html.matchAll(/<details[^>]*>/g)].map(([tag]) => tag)

describe('BaseAccordion', () => {
  it('renders each item as a closed details element with the label in its summary', async () => {
    const html = await renderToString(<BaseAccordion items={ITEMS} />)

    assert.equal(details(html).length, 2)
    for (const tag of details(html)) assert.doesNotMatch(tag, / open[ >=]/)
    assert.match(html, /<summary[^>]*><span[^>]*>カテゴリ<\/span>/)
    assert.match(html, /<\/summary><div[^>]*><p>カテゴリの中身<\/p><\/div><\/details>/)
  })

  it('opens the items it is given', async () => {
    const html = await renderToString(<BaseAccordion items={ITEMS} defaultValue={['taste']} />)
    const [drink, taste] = details(html)

    assert.doesNotMatch(drink!, / open[ >=]/)
    assert.match(taste!, / open[ >=]/)
  })

  it('leaves several items open independently, with no name grouping them', async () => {
    const html = await renderToString(
      <BaseAccordion items={ITEMS} defaultValue={['drink', 'taste']} />
    )

    for (const tag of details(html)) {
      assert.match(tag, / open[ >=]/)
      assert.doesNotMatch(tag, / name=/)
    }
  })
})
