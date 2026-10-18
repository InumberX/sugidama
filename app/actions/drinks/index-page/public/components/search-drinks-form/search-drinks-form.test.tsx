import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { clientModuleUrl } from '../../../../../../ui/public/client-module-url.ts'
import { CONTAINER_QUERY, MEDIA_QUERY } from '../../../../../../ui/styles/public/media-query.ts'
import * as styles from './search-drinks-form.styles.ts'
import { SearchDrinksForm } from './search-drinks-form.tsx'
import type { SearchDrinksFormProps } from './search-drinks-form.types.ts'

const props: SearchDrinksFormProps = {
  action: '/drinks',
  resetHref: '/drinks',
  keyword: '',
  conditions: [
    {
      name: 'taste',
      label: '味わい',
      options: [
        { value: '11', label: '辛口' },
        { value: '12', label: '甘口' },
      ],
      selected: ['12'],
    },
  ],
  messages: {
    reset: 'リセット',
    keywordTitle: 'キーワード',
    keywordPlaceholder: '',
    search: '検索',
    conditionsLabel: '条件',
    showConditions: '条件を追加',
    hideConditions: '閉じる',
    selectedCount: { before: '（', after: '件選択中）' },
  },
}

describe('SearchDrinksForm', () => {
  it('names its own compiled module and export as the client entry', async () => {
    const root = path.resolve(import.meta.dirname, '../../../../../../..')
    const source = path.relative(root, fileURLToPath(import.meta.url)).replace('.test.tsx', '.tsx')
    const html = await renderToString(<SearchDrinksForm {...props} />)
    const data = JSON.parse(
      html.match(/<script type="application\/json" id="rmx-data">(.*?)<\/script>/)![1]!
    )
    const [entry] = Object.values(data.h) as { moduleUrl: string; exportName: string }[]

    assert.equal(entry?.moduleUrl, clientModuleUrl(source.split(path.sep).join('/')))
    assert.equal(entry?.exportName, 'SearchDrinksForm')
  })

  it('counts the selected options of each condition', async () => {
    const html = await renderToString(<SearchDrinksForm {...props} />)

    // The digits are for the eye; the count is spoken as words.
    assert.match(html, /味わい<i aria-hidden="true"[^>]*>1<\/i><span[^>]*>（1件選択中）<\/span>/)
    assert.match(html, /name="taste" value="12" checked/)
  })
})

describe('searchDrinksConditions', () => {
  it('keeps folded conditions out of the tab order from the first paint, not only after hydration', () => {
    const at = (key: string) =>
      (styles.searchDrinksConditions as Record<string, unknown>)[key] as
        | Record<string, unknown>
        | undefined

    assert.equal(styles.searchDrinksConditions.visibility, 'hidden')
    assert.equal(styles.searchDrinksConditions__open.visibility, 'visible')
    assert.equal(at(CONTAINER_QUERY.MD)?.visibility, 'visible')
    assert.equal(at(MEDIA_QUERY.NOT_SCRIPTING)?.visibility, 'visible')
  })
})
