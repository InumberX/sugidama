import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { ReplaceNewLineText } from './replace-new-line-text.tsx'

describe('ReplaceNewLineText', () => {
  it('turns each newline into a <br>', async () => {
    const html = await renderToString(<ReplaceNewLineText text={'一行目\n二行目\r\n三行目'} />)

    assert.match(html, /一行目<br \/>二行目<br \/>三行目/)
  })

  it('keeps the text escaped', async () => {
    const html = await renderToString(<ReplaceNewLineText text={'<b>a</b>\nb'} />)

    assert.match(html, /&lt;b&gt;a&lt;\/b&gt;<br \/>b/)
  })

  it('renders text without a newline as it is', async () => {
    assert.equal(await renderToString(<ReplaceNewLineText text="a" />), 'a')
  })
})
