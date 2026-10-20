import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { ArticleInfo } from './article-info.tsx'

describe('ArticleInfo', () => {
  it('is one description list, a div per term', async () => {
    const html = await renderToString(
      <ArticleInfo
        items={[
          { title: '製造元', text: '朝日酒造' },
          { title: 'コメント', text: '一行目\n二行目' },
        ]}
      />
    )

    assert.equal(html.match(/<dl[ >]/g)?.length, 1)
    assert.match(html, /<div[^>]*><dt[^>]*>製造元<\/dt><dd[^>]*>朝日酒造<\/dd><\/div>/)
    assert.match(html, /一行目<br \/>二行目/)
  })

  it('opens each link in a new tab without handing it the opener', async () => {
    const html = await renderToString(
      <ArticleInfo
        items={[{ title: 'リンク', links: [{ text: '公式', url: 'https://example.com/' }] }]}
      />
    )

    assert.match(
      html,
      /<a href="https:\/\/example\.com\/" target="_blank" rel="noopener noreferrer"/
    )
    assert.match(html, />公式</)
  })
})
