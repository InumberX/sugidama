import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { BaseAlert } from './base-alert.tsx'

describe('BaseAlert', () => {
  it('draws the icon of its color, not always the error one', async () => {
    const success = await renderToString(<BaseAlert color="success" title="保存しました" />)
    const error = await renderToString(<BaseAlert color="error" title="失敗しました" />)

    assert.match(success, /icon-check\.svg/)
    assert.doesNotMatch(success, /icon-error\.svg/)
    assert.match(error, /icon-error\.svg/)
  })

  it('is announced as an alert', async () => {
    assert.match(
      await renderToString(<BaseAlert color="error" title="失敗しました" />),
      /role="alert"/
    )
  })
})
