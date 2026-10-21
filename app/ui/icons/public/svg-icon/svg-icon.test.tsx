import { existsSync } from 'node:fs'
import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import * as styles from './svg-icon.styles.ts'
import { SvgIcon } from './svg-icon.tsx'
import type { SvgIconVariant } from './svg-icon.types.ts'

describe('SvgIcon', () => {
  it('masks the variant file and colors it with the background', async () => {
    const html = await renderToString(<SvgIcon variant="home" />)

    // The cache buster is there once app/router.ts has set it; static-url.test.ts covers it.
    assert.match(html, /[^-]mask-image: url\("\/static\/img\/icon-home\.svg(?:\?[^"]*)?"\)/)
    // The prefixed form for Chrome before 120 and Safari before 15.4.
    assert.match(html, /-webkit-mask-image: url\("\/static\/img\/icon-home\.svg(?:\?[^"]*)?"\)/)
    assert.match(html, /-webkit-mask-size: contain/)
    assert.match(html, /background-color: var\(--color-util-black\)/)
  })

  it('has a file in public/ for every variant', () => {
    for (const variant of Object.keys(styles.svgIconFiles) as SvgIconVariant[]) {
      const recipe = styles.getSvgIconMask(variant)
      const path = /url\("(\/static\/img\/[^"?]+)/.exec(String(recipe.maskImage))?.[1]
      assert.ok(path, variant)
      assert.ok(existsSync(new URL(`../../../../../public${path}`, import.meta.url)), path)
    }
  })

  it('is decorative without a title and an image with one', async () => {
    const decorative = await renderToString(<SvgIcon variant="search" />)
    const titled = await renderToString(<SvgIcon variant="search" title="検索" />)

    assert.match(decorative, /<i[^>]*aria-hidden="true"/)
    assert.doesNotMatch(decorative, /role="img"/)
    assert.match(titled, /<i[^>]*role="img"[^>]*aria-label="検索"/)
    assert.doesNotMatch(titled, /aria-hidden/)
  })

  it('merges size and color overrides into the one class', async () => {
    const html = await renderToString(
      <SvgIcon
        variant="slash"
        styleOverrides={{ backgroundColor: 'currentColor', inlineSize: '20px' }}
      />
    )

    assert.equal([...html.matchAll(/class="([^"]+)"/g)].length, 1)
    assert.match(html, /background-color: currentColor/)
    assert.doesNotMatch(html, /var\(--color-util-black\)/)
    assert.match(html, /inline-size: 20px/)
  })
})
