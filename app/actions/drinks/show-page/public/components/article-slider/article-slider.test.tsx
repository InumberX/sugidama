import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { clientModuleUrl } from '../../../../../../ui/public/client-module-url.ts'
import { ArticleSlider } from './article-slider.tsx'

const slides = ['a', 'b'].map((name, i) => ({
  src: `https://example.com/${name}.webp`,
  alt: name,
  thumbnailLabel: `${i + 1}枚目`,
}))
const messages = { prev: '前へ', next: '次へ' }

describe('ArticleSlider', () => {
  it('names its own compiled module and export as the client entry', async () => {
    const root = path.resolve(import.meta.dirname, '../../../../../../..')
    const source = path.relative(root, fileURLToPath(import.meta.url)).replace('.test.tsx', '.tsx')
    const html = await renderToString(<ArticleSlider slides={slides} messages={messages} />)
    const data = JSON.parse(
      html.match(/<script type="application\/json" id="rmx-data">(.*?)<\/script>/)![1]!
    )
    const [entry] = Object.values(data.h) as { moduleUrl: string; exportName: string }[]

    assert.equal(entry?.moduleUrl, clientModuleUrl(source.split(path.sep).join('/')))
    assert.equal(entry?.exportName, 'ArticleSlider')
  })

  it('renders a scroll-snap strip, with the buttons disabled until it starts', async () => {
    const html = await renderToString(<ArticleSlider slides={slides} messages={messages} />)

    assert.match(html, /scroll-snap-type:\s*x mandatory/)
    assert.equal(html.match(/<button type="button"[^>]* disabled/g)?.length, 2)
    // Thumbnails stay out of the tab order while they do nothing.
    assert.equal(html.match(/<button[^>]*tabindex="-1"[^>]*aria-label="\d枚目"/g)?.length, 2)
  })

  it('has no thumbnails for a single image', async () => {
    const html = await renderToString(
      <ArticleSlider slides={slides.slice(0, 1)} messages={messages} />
    )

    assert.doesNotMatch(html, /<button/)
  })
})
