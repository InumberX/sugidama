import { readFileSync } from 'node:fs'
import * as assert from 'remix/assert'
import { css } from 'remix/component'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { getClampPx, getClampRem, getFontSize, getLineClamp, getTransition } from './mixins.ts'

describe('getTransition', () => {
  it('defaults the speed and omits an unset delay', () => {
    assert.equal(getTransition([{ property: 'color' }]), '0.3s color')
    assert.equal(getTransition([{ property: 'color', speed: 0.2, delay: 0.1 }]), '0.2s 0.1s color')
  })

  it('joins several properties into one declaration', () => {
    assert.equal(
      getTransition([{ property: 'color' }, { property: 'background-color' }]),
      '0.3s color, 0.3s background-color'
    )
  })
})

/**
 * Evaluates the middle term of a clamp() at a viewport width, in px. A string
 * comparison alone would not catch a line that misses its ends — which is the
 * bug develop's `getClampPx` had.
 */
const evaluateAt = (clamp: string, viewport: number): number => {
  const match = /^clamp\([^,]+, (-?[\d.]+)(px|rem) \+ (-?[\d.]+)vi, [^)]+\)$/.exec(clamp)
  if (!match) throw new Error(`unexpected clamp: ${clamp}`)
  const [, intercept, unit, slope] = match
  return Number(intercept) * (unit === 'rem' ? 16 : 1) + (Number(slope) / 100) * viewport
}

describe('getClampPx / getClampRem', () => {
  const pairs: [number, number][] = [
    [10, 11],
    [12, 14],
    [14, 16],
    [20, 28],
    [24, 40],
    [40, 80],
    [16, 16],
  ]

  it('reaches the minimum at 360px and the maximum at 1400px, within 0.01px', () => {
    for (const [min, max] of pairs) {
      for (const clamp of [getClampPx(min, max), getClampRem(min, max)]) {
        assert.ok(Math.abs(evaluateAt(clamp, 360) - min) < 0.01, `${clamp} at 360px`)
        assert.ok(Math.abs(evaluateAt(clamp, 1400) - max) < 0.01, `${clamp} at 1400px`)
      }
    }
  })

  it('prints the bounds in the helper unit, against the 16px root for rem', () => {
    assert.equal(getClampPx(40, 80), 'clamp(40px, 26.154px + 3.8462vi, 80px)')
    assert.equal(getClampRem(14, 16), 'clamp(0.875rem, 0.8317rem + 0.1923vi, 1rem)')
  })

  it('collapses to a constant when both ends are equal', () => {
    assert.equal(getClampRem(16, 16), 'clamp(1rem, 1rem + 0vi, 1rem)')
  })
})

describe('getFontSize', () => {
  it('converts px to rem against the 16px root', () => {
    assert.equal(getFontSize(10), '0.625rem')
    assert.equal(getFontSize(12), '0.75rem')
  })
})

describe('getLineClamp', () => {
  it('needs -webkit-box display to work at all', async () => {
    const html = await renderToString(<span mix={css(getLineClamp(3))}>x</span>)

    assert.match(html, /display: -webkit-box/)
    assert.match(html, /-webkit-line-clamp: 3/)
    assert.match(html, /overflow: hidden/)
  })
})

// public/static/css/app.css は PostCSS を通らないため、これらの値は手書きです。
// CSS と TS は別言語で互いに導出できず、片方だけ変えても他は何も落ちません。
// ここで突き合わせておかないと、コメントが指す関数と実際の値が黙って食い違います。
describe('app.css の手書き clamp 値', () => {
  const appCss = readFileSync(
    new URL('../../../../public/static/css/app.css', import.meta.url),
    'utf8'
  )

  it('matches getClampRem(14, 16), as its own comment claims', () => {
    assert.equal(appCss.includes(`font-size: ${getClampRem(14, 16)};`), true)
  })
})
