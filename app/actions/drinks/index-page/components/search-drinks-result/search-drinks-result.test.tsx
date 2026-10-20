import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { SEARCH_DRINKS_RESULT_ID, SearchDrinksResult } from './search-drinks-result.tsx'

const MESSAGES = {
  noResultTitle: '検索結果がありません。',
  noResultDescription: '条件を変えてください。',
  errorTitle: '取得できませんでした',
  errorMessageTitle: 'エラーメッセージ:',
  paginationLabel: 'ページ送り',
  prevPage: '前へ',
  nextPage: '次へ',
}

const render = (result: Parameters<typeof SearchDrinksResult>[0]['props']['result']) =>
  renderToString(
    <SearchDrinksResult
      result={result}
      currentPage={1}
      hrefFor={(page) => `/drinks?page=${page}`}
      messages={MESSAGES}
    />
  )

describe('SearchDrinksResult', () => {
  it('says so when nothing matches, without pagination', async () => {
    const html = await render({ success: true, cards: [], totalPage: 1 })

    assert.match(html, /検索結果がありません。/)
    assert.doesNotMatch(html, /<nav/)
  })

  it('shows a failed search as an alert, still carrying the id pagination links point at', async () => {
    const html = await render({ success: false, status: 503, message: 'down' })

    assert.match(html, new RegExp(`<div id="${SEARCH_DRINKS_RESULT_ID}">`))
    assert.match(html, /role="alert"/)
    assert.match(html, /エラーメッセージ:down/)
  })
})
